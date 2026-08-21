const ADSENSE_CLIENT_ID = 'ca-pub-1560537840529504';
const ADSENSE_SCRIPT_URL =
  `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`;

export function GoogleAdSense() {
  return (
    <script
      async
      id="google-adsense"
      src={ADSENSE_SCRIPT_URL}
      crossOrigin="anonymous"
      suppressHydrationWarning
    />
  );
}
