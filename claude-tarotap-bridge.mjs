import http from "node:http";
import { randomUUID } from "node:crypto";

const PORT = Number(process.env.BRIDGE_PORT || 8765);
const HOST = process.env.BRIDGE_HOST || "127.0.0.1";
const UPSTREAM_URL = process.env.TAROTAP_BASE_URL || "https://tarotap.pro/v1/responses";
const UPSTREAM_API_KEY = process.env.TAROTAP_API_KEY || "";
const UPSTREAM_MODEL = process.env.TAROTAP_MODEL || "gpt-5.4";
const DEBUG = process.env.BRIDGE_DEBUG === "1";
const UPSTREAM_TIMEOUT_MS = Number(process.env.TAROTAP_TIMEOUT_MS || 90000);
const UPSTREAM_MAX_RETRIES = Number(process.env.TAROTAP_MAX_RETRIES || 2);
const UPSTREAM_RETRY_BASE_MS = Number(process.env.TAROTAP_RETRY_BASE_MS || 800);
const UPSTREAM_RETRY_MAX_MS = Number(process.env.TAROTAP_RETRY_MAX_MS || 5000);
const RETRYABLE_STATUS_CODES = new Set([408, 409, 425, 429, 500, 502, 503, 504]);

function debugLog(...args) {
  if (DEBUG) {
    console.error("[bridge]", ...args);
  }
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf8");
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function sendAnthropicError(res, statusCode, message, errorType = "api_error") {
  res.writeHead(statusCode, { "content-type": "application/json; charset=utf-8" });
  res.end(
    JSON.stringify({
      type: "error",
      error: {
        type: errorType,
        message,
      },
    }),
  );
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseJson(text) {
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { raw: text };
  }
}

function backoffDelay(attempt) {
  const delay = UPSTREAM_RETRY_BASE_MS * 2 ** Math.max(0, attempt - 1);
  return Math.min(delay, UPSTREAM_RETRY_MAX_MS);
}

function shouldRetryStatus(statusCode) {
  return RETRYABLE_STATUS_CODES.has(statusCode);
}

function toText(value) {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }
        if (item?.type === "text" || item?.type === "output_text" || item?.type === "input_text") {
          return item.text || "";
        }
        if (item?.type === "tool_result") {
          return toText(item.content);
        }
        return JSON.stringify(item);
      })
      .filter(Boolean)
      .join("\n");
  }

  if (value && typeof value === "object") {
    if ("text" in value && typeof value.text === "string") {
      return value.text;
    }
    if ("content" in value) {
      return toText(value.content);
    }
    return JSON.stringify(value);
  }

  if (value == null) {
    return "";
  }

  return String(value);
}

function contentArray(value) {
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value === "string") {
    return [{ type: "text", text: value }];
  }
  if (value == null) {
    return [];
  }
  return [value];
}

function convertMessagesToResponsesInput(messages = []) {
  const input = [];

  for (const message of messages) {
    const role = message?.role === "assistant" ? "assistant" : "user";
    const blocks = contentArray(message?.content);
    let currentTextBlocks = [];

    const flushCurrentMessage = () => {
      if (currentTextBlocks.length === 0) {
        return;
      }

      input.push({
        role,
        content: currentTextBlocks.map((block) => ({
          type: role === "assistant" ? "output_text" : "input_text",
          text: block.text,
        })),
      });
      currentTextBlocks = [];
    };

    for (const block of blocks) {
      if (!block) {
        continue;
      }

      if (typeof block === "string") {
        currentTextBlocks.push({ text: block });
        continue;
      }

      if (block.type === "text") {
        currentTextBlocks.push({ text: block.text || "" });
        continue;
      }

      if (role === "assistant" && block.type === "tool_use") {
        flushCurrentMessage();
        input.push({
          type: "function_call",
          call_id: block.id || randomUUID(),
          name: block.name,
          arguments: JSON.stringify(block.input || {}),
        });
        continue;
      }

      if (role === "user" && block.type === "tool_result") {
        flushCurrentMessage();
        input.push({
          type: "function_call_output",
          call_id: block.tool_use_id,
          output: toText(block.content),
        });
        continue;
      }

      if (block.type === "image" || block.type === "thinking" || block.type === "redacted_thinking") {
        continue;
      }

      currentTextBlocks.push({ text: toText(block) });
    }

    flushCurrentMessage();
  }

  return input;
}

function convertTools(tools = []) {
  return tools
    .filter((tool) => tool?.name && tool?.input_schema)
    .map((tool) => ({
      type: "function",
      name: tool.name,
      description: tool.description || "",
      parameters: tool.input_schema,
    }));
}

function convertToolChoice(toolChoice) {
  if (!toolChoice || typeof toolChoice !== "object") {
    return undefined;
  }

  if (toolChoice.type === "auto") {
    return "auto";
  }

  if (toolChoice.type === "any") {
    return "required";
  }

  if (toolChoice.type === "tool" && toolChoice.name) {
    return {
      type: "function",
      name: toolChoice.name,
    };
  }

  return undefined;
}

function convertThinking(thinking) {
  if (!thinking || typeof thinking !== "object") {
    return undefined;
  }

  if (thinking.type === "enabled") {
    return { effort: "medium" };
  }

  if (thinking.type === "adaptive") {
    return { effort: "low" };
  }

  return undefined;
}

function buildUpstreamPayload(body) {
  const payload = {
    model: UPSTREAM_MODEL,
    stream: false,
    input: convertMessagesToResponsesInput(body.messages || []),
  };

  const instructions = contentArray(body.system)
    .map((block) => (typeof block === "string" ? block : block?.text || ""))
    .filter(Boolean)
    .join("\n\n");

  if (instructions) {
    payload.instructions = instructions;
  }

  if (Array.isArray(body.tools) && body.tools.length > 0) {
    payload.tools = convertTools(body.tools);
  }

  const toolChoice = convertToolChoice(body.tool_choice);
  if (toolChoice) {
    payload.tool_choice = toolChoice;
  }

  if (typeof body.max_tokens === "number") {
    payload.max_output_tokens = body.max_tokens;
  }

  const reasoning = convertThinking(body.thinking);
  if (reasoning) {
    payload.reasoning = reasoning;
  }

  return payload;
}

function buildAnthropicBlocksFromResponses(response) {
  const blocks = [];

  for (const item of response.output || []) {
    if (item.type === "message") {
      for (const part of item.content || []) {
        if (part.type === "output_text") {
          blocks.push({
            type: "text",
            text: part.text || "",
          });
        }
      }
      continue;
    }

    if (item.type === "function_call") {
      let parsedArguments = {};
      try {
        parsedArguments = item.arguments ? JSON.parse(item.arguments) : {};
      } catch {
        parsedArguments = { raw: item.arguments || "" };
      }

      blocks.push({
        type: "tool_use",
        id: item.call_id || randomUUID(),
        name: item.name,
        input: parsedArguments,
      });
    }
  }

  if (blocks.length === 0) {
    blocks.push({ type: "text", text: "" });
  }

  return blocks;
}

function buildAnthropicResponse(requestBody, upstreamResponse) {
  const content = buildAnthropicBlocksFromResponses(upstreamResponse);
  const hasToolUse = content.some((block) => block.type === "tool_use");

  return {
    id: `msg_${randomUUID().replace(/-/g, "")}`,
    type: "message",
    role: "assistant",
    model: requestBody.model || requestBody?.metadata?.model || "claude-sonnet-4-20250514",
    content,
    stop_reason: hasToolUse ? "tool_use" : "end_turn",
    stop_sequence: null,
    usage: {
      input_tokens: upstreamResponse?.usage?.input_tokens || 0,
      output_tokens: upstreamResponse?.usage?.output_tokens || 0,
    },
  };
}

function writeSse(res, event, data) {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

function sendAnthropicStream(res, anthropicMessage) {
  res.writeHead(200, {
    "content-type": "text/event-stream; charset=utf-8",
    "cache-control": "no-cache",
    connection: "keep-alive",
  });

  writeSse(res, "message_start", {
    type: "message_start",
    message: {
      ...anthropicMessage,
      content: [],
      stop_reason: null,
      usage: {
        input_tokens: anthropicMessage.usage.input_tokens,
        output_tokens: 0,
      },
    },
  });

  anthropicMessage.content.forEach((block, index) => {
    if (block.type === "text") {
      writeSse(res, "content_block_start", {
        type: "content_block_start",
        index,
        content_block: {
          type: "text",
          text: "",
        },
      });
      writeSse(res, "content_block_delta", {
        type: "content_block_delta",
        index,
        delta: {
          type: "text_delta",
          text: block.text,
        },
      });
      writeSse(res, "content_block_stop", {
        type: "content_block_stop",
        index,
      });
      return;
    }

    if (block.type === "tool_use") {
      writeSse(res, "content_block_start", {
        type: "content_block_start",
        index,
        content_block: {
          type: "tool_use",
          id: block.id,
          name: block.name,
          input: {},
        },
      });
      writeSse(res, "content_block_delta", {
        type: "content_block_delta",
        index,
        delta: {
          type: "input_json_delta",
          partial_json: JSON.stringify(block.input || {}),
        },
      });
      writeSse(res, "content_block_stop", {
        type: "content_block_stop",
        index,
      });
    }
  });

  writeSse(res, "message_delta", {
    type: "message_delta",
    delta: {
      stop_reason: anthropicMessage.stop_reason,
      stop_sequence: anthropicMessage.stop_sequence,
    },
    usage: {
      output_tokens: anthropicMessage.usage.output_tokens,
    },
  });

  writeSse(res, "message_stop", {
    type: "message_stop",
  });

  res.end();
}

async function callUpstream(payload) {
  let lastError;

  for (let attempt = 0; attempt <= UPSTREAM_MAX_RETRIES; attempt += 1) {
    const attemptNumber = attempt + 1;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

    try {
      debugLog(`upstream attempt ${attemptNumber}/${UPSTREAM_MAX_RETRIES + 1}`);
      const response = await fetch(UPSTREAM_URL, {
        method: "POST",
        headers: {
          authorization: `Bearer ${UPSTREAM_API_KEY}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeout);
      const text = await response.text();
      const parsed = parseJson(text);

      if (response.ok) {
        return parsed;
      }

      const message =
        parsed?.error?.message ||
        parsed?.message ||
        `Upstream request failed with status ${response.status}`;
      const error = new Error(message);
      error.statusCode = response.status;
      error.errorType = parsed?.error?.type || "api_error";
      lastError = error;

      if (attempt >= UPSTREAM_MAX_RETRIES || !shouldRetryStatus(response.status)) {
        throw error;
      }

      const delay = backoffDelay(attempt);
      debugLog(`upstream retry in ${delay}ms after status ${response.status}`);
      await sleep(delay);
    } catch (error) {
      clearTimeout(timeout);

      const isAbort = error?.name === "AbortError";
      if (isAbort) {
        const timeoutError = new Error(`Upstream timeout after ${UPSTREAM_TIMEOUT_MS}ms`);
        timeoutError.statusCode = 504;
        timeoutError.errorType = "api_error";
        lastError = timeoutError;
      } else if (error instanceof Error) {
        lastError = error;
      } else {
        lastError = new Error(String(error));
      }

      const retryableNetworkError =
        isAbort ||
        lastError?.cause?.code === "ECONNRESET" ||
        lastError?.cause?.code === "ETIMEDOUT" ||
        lastError?.cause?.code === "ECONNREFUSED" ||
        lastError?.cause?.code === "EAI_AGAIN";
      const retryableStatusError =
        typeof lastError?.statusCode === "number" && shouldRetryStatus(lastError.statusCode);
      const retryableError = retryableNetworkError || retryableStatusError;

      if (attempt >= UPSTREAM_MAX_RETRIES || !retryableError) {
        throw lastError;
      }

      const delay = backoffDelay(attempt);
      debugLog(`upstream retry in ${delay}ms after error`, lastError.message);
      await sleep(delay);
    }
  }

  throw lastError || new Error("Unknown upstream error");
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === "HEAD" && req.url === "/") {
      res.writeHead(200);
      res.end();
      return;
    }

    if (req.method === "GET" && (req.url === "/" || req.url === "/health")) {
      res.writeHead(200, { "content-type": "application/json; charset=utf-8" });
      res.end(
        JSON.stringify({
          ok: true,
          upstream: UPSTREAM_URL,
          model: UPSTREAM_MODEL,
          timeoutMs: UPSTREAM_TIMEOUT_MS,
          maxRetries: UPSTREAM_MAX_RETRIES,
          retryBaseMs: UPSTREAM_RETRY_BASE_MS,
          retryMaxMs: UPSTREAM_RETRY_MAX_MS,
        }),
      );
      return;
    }

    if (req.method !== "POST" || !req.url.startsWith("/v1/messages")) {
      sendAnthropicError(res, 404, `Unhandled route: ${req.method} ${req.url}`, "not_found_error");
      return;
    }

    if (!UPSTREAM_API_KEY) {
      sendAnthropicError(res, 500, "Missing TAROTAP_API_KEY", "authentication_error");
      return;
    }

    const requestBody = await readJsonBody(req);
    const upstreamPayload = buildUpstreamPayload(requestBody);
    debugLog("upstream payload", JSON.stringify(upstreamPayload));

    const upstreamResponse = await callUpstream(upstreamPayload);
    debugLog("upstream response", JSON.stringify(upstreamResponse));

    const anthropicResponse = buildAnthropicResponse(requestBody, upstreamResponse);

    if (requestBody.stream === true) {
      sendAnthropicStream(res, anthropicResponse);
      return;
    }

    res.writeHead(200, { "content-type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(anthropicResponse));
  } catch (error) {
    debugLog("request failed", error);
    sendAnthropicError(
      res,
      error.statusCode || 500,
      error instanceof Error ? error.message : String(error),
      error.errorType || "api_error",
    );
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Claude <-> Tarotap bridge listening on http://${HOST}:${PORT}`);
  console.log(`Forwarding /v1/messages to ${UPSTREAM_URL} using model ${UPSTREAM_MODEL}`);
});
