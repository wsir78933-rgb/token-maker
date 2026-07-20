import { requireCspNonce } from '@/lib/security/require-csp-nonce';

const ADSENSE_CLIENT_ID = 'ca-pub-1560537840529504';
const ADSENSE_SCRIPT_URL =
  `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`;

interface GoogleAdSenseProps {
  nonce: string;
}

export function GoogleAdSense({ nonce }: GoogleAdSenseProps) {
  const requestNonce = requireCspNonce('GoogleAdSense', nonce);

  return (
    <script
      async
      id="google-adsense"
      src={ADSENSE_SCRIPT_URL}
      crossOrigin="anonymous"
      nonce={requestNonce}
      suppressHydrationWarning
    />
  );
}
