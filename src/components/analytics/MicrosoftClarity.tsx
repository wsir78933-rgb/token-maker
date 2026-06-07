import Script from 'next/script';

const CLARITY_PROJECT_ID = 'wlcq64go88';
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
const CLARITY_SCRIPT_STRATEGY = 'lazyOnload';

export function MicrosoftClarity() {
  if (IS_DEVELOPMENT) {
    return null;
  }

  return (
    <Script
      id="microsoft-clarity"
      strategy={CLARITY_SCRIPT_STRATEGY}
      type="text/javascript"
      dangerouslySetInnerHTML={{
        __html: `
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
      `,
      }}
    />
  );
}
