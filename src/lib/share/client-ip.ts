import { isIP } from 'node:net';

function normalizeIpCandidate(value: string | null) {
  const token = value?.trim();
  if (!token) return null;

  if (isIP(token)) return token;

  const bracketedIpv6 = token.match(/^\[([^\]]+)](?::\d+)?$/)?.[1];
  if (bracketedIpv6 && isIP(bracketedIpv6)) return bracketedIpv6;

  const ipv4WithPort = token.match(/^(\d{1,3}(?:\.\d{1,3}){3})(?::\d+)?$/)?.[1];
  if (ipv4WithPort && isIP(ipv4WithPort)) return ipv4WithPort;

  return null;
}

export function getClientIp(headers: Headers) {
  return normalizeIpCandidate(headers.get('x-vercel-forwarded-for')) ?? 'anonymous';
}
