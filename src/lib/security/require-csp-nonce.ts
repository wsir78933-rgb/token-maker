export function requireCspNonce(scriptName: string, receivedNonce: unknown): string {
  if (typeof receivedNonce !== 'string' || receivedNonce.trim().length === 0) {
    throw new Error(
      `${scriptName} requires a non-empty CSP nonce; received value: ${String(receivedNonce)}`
    );
  }

  return receivedNonce;
}
