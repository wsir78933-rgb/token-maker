import { isIP } from 'node:net';

const ANONYMOUS_CLIENT_IP = 'anonymous';

export function getCloudflareConnectingIp(headers: Headers) {
  const connectingIp = headers.get('CF-Connecting-IP')?.trim();
  if (!connectingIp || isIP(connectingIp) === 0) {
    return ANONYMOUS_CLIENT_IP;
  }

  return connectingIp;
}
