let fallbackIdCounter = 0;

/**
 * Creates a browser-local identifier for editable project state. Native UUIDs
 * are preferred; the timestamp/counter fallback keeps constrained browser
 * runtimes functional without treating project IDs as security credentials.
 */
export function createLocalCoatId(): string {
  const randomUuid = globalThis.crypto?.randomUUID;
  if (typeof randomUuid === 'function') return randomUuid.call(globalThis.crypto);
  fallbackIdCounter += 1;
  return `local-${Date.now().toString(36)}-${fallbackIdCounter.toString(36)}`;
}
