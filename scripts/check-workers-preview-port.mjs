function validateWorkersPreviewPort(rawWorkersPreviewPort) {
  if (rawWorkersPreviewPort === undefined || rawWorkersPreviewPort === "") return;

  const isDecimalInteger = /^[0-9]+$/.test(rawWorkersPreviewPort);
  const workersPreviewPort = Number(rawWorkersPreviewPort);
  if (!isDecimalInteger || !Number.isInteger(workersPreviewPort) || workersPreviewPort > 65535) {
    throw new Error(
      `WORKERS_PREVIEW_PORT must be a decimal integer from 0 to 65535; received ${JSON.stringify(rawWorkersPreviewPort)}.`,
    );
  }
}

validateWorkersPreviewPort(process.env.WORKERS_PREVIEW_PORT);
