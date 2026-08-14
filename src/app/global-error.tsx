'use client';

import { useEffect } from 'react';

interface GlobalErrorPageProps {
  error: Error & { digest?: string };
  retry: () => void;
}

export default function GlobalErrorPage({ error, retry }: GlobalErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          alignItems: 'center',
          background: '#090b10',
          color: '#f5f2ea',
          display: 'flex',
          fontFamily: 'Avenir Next, Segoe UI, sans-serif',
          justifyContent: 'center',
          margin: 0,
          minHeight: '100vh',
          padding: '24px',
        }}
      >
        <main aria-labelledby="global-error-heading" style={{ maxWidth: '560px', textAlign: 'center' }}>
          <p style={{ color: '#d7b46a', fontSize: '14px', fontWeight: 700, letterSpacing: '0.18em', margin: 0 }}>
            TOKEN MAKER
          </p>
          <h1 id="global-error-heading" style={{ fontSize: '32px', lineHeight: 1.2, margin: '16px 0' }}>
            We could not load this page
          </h1>
          <p style={{ color: '#c9c4bb', lineHeight: 1.6, margin: 0 }}>
            Please try again. If the problem continues, return to the homepage.
          </p>
          <button
            style={{
              background: '#d7b46a',
              border: 0,
              borderRadius: '6px',
              color: '#17120a',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 700,
              marginTop: '24px',
              padding: '12px 18px',
            }}
            type="button"
            onClick={retry}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
