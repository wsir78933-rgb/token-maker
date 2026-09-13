import { execFileSync } from "node:child_process";

const DEFAULT_PORT = 40001;

function parsePort(raw) {
  const port = Number(raw);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid port: ${String(raw)}`);
  }
  return port;
}

function listListenPids(port) {
  try {
    const output = execFileSync("lsof", [`-tiTCP:${port}`, "-sTCP:LISTEN"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    return [...new Set(output.trim().split(/\s+/).filter(Boolean))];
  } catch (error) {
    if (error.status === 1 && !String(error.stdout ?? "").trim()) {
      return [];
    }
    throw error;
  }
}

function killPid(pid, signal) {
  try {
    process.kill(Number(pid), signal);
  } catch (error) {
    if (error.code === "ESRCH") return;
    throw error;
  }
}

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function waitUntilPortFree(port, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (listListenPids(port).length === 0) return true;
    sleep(50);
  }
  return listListenPids(port).length === 0;
}

function freePort(port) {
  const pids = listListenPids(port);
  if (pids.length === 0) return;

  process.stderr.write(`Port ${port} in use by PID ${pids.join(", ")}; killing it.\n`);
  for (const pid of pids) killPid(pid, "SIGTERM");

  if (waitUntilPortFree(port, 2000)) return;

  const leftover = listListenPids(port);
  for (const pid of leftover) killPid(pid, "SIGKILL");
  if (waitUntilPortFree(port, 1000)) return;

  throw new Error(
    `Port ${port} still in use after kill: PID ${listListenPids(port).join(", ")}`,
  );
}

freePort(parsePort(process.argv[2] ?? String(DEFAULT_PORT)));
