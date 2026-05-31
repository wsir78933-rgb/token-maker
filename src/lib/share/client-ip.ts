import { isIP } from 'node:net';

function normalizeIpCandidate(value: string | null) {
  const token = value?.trim().replace(/^"|"$/g, '');
  if (!token) return null;

  if (isIP(token)) return token;

  const bracketedIpv6 = token.match(/^\[([^\]]+)](?::\d+)?$/)?.[1];
  if (bracketedIpv6 && isIP(bracketedIpv6)) return bracketedIpv6;

  const ipv4WithPort = token.match(/^(\d{1,3}(?:\.\d{1,3}){3})(?::\d+)?$/)?.[1];
  if (ipv4WithPort && isIP(ipv4WithPort)) return ipv4WithPort;

  return null;
}

function getForwardedForCandidates(headers: Headers) {
  return (
    headers
      .get('x-forwarded-for')
      ?.split(',')
      .map((value) => value.trim()) ?? []
  );
}

export function getClientIp(headers: Headers) {
  const candidates = [
    headers.get('cf-connecting-ip'),
    headers.get('true-client-ip'),
    headers.get('x-real-ip'),
    ...getForwardedForCandidates(headers),
  ];

  for (const candidate of candidates) {
    const normalizedIp = normalizeIpCandidate(candidate);
    if (normalizedIp) return normalizedIp;
  }

  return 'anonymous';
}
