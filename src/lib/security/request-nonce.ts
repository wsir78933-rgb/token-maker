import 'server-only';

import { headers } from 'next/headers';
import { requireCspNonce } from './require-csp-nonce';

export async function getRequestNonce() {
  const nonce = (await headers()).get('x-nonce');

  return requireCspNonce('getRequestNonce', nonce);
}
