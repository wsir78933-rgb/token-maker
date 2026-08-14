import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <main
      aria-labelledby="not-found-heading"
      style={{
        alignItems: 'center',
        background: '#090b10',
        boxSizing: 'border-box',
        color: '#f5f2ea',
        display: 'flex',
        fontFamily: 'Avenir Next, Segoe UI, sans-serif',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '24px',
      }}
    >
      <section style={{ maxWidth: '560px', textAlign: 'center' }}>
        <p style={{ color: '#d7b46a', fontSize: '14px', fontWeight: 700, letterSpacing: '0.18em', margin: 0 }}>
          404
        </p>
        <h1 id="not-found-heading" style={{ fontSize: '32px', lineHeight: 1.2, margin: '16px 0' }}>
          Page not found
        </h1>
        <p style={{ color: '#c9c4bb', lineHeight: 1.6, margin: 0 }}>
          The page you requested is unavailable or has moved.
        </p>
        <p style={{ color: '#c9c4bb', fontSize: '14px', lineHeight: 1.6, margin: '16px 0 0' }}>
          页面不存在或已移动。
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginTop: '24px' }}>
          <Link
            href="/"
            style={{
              background: '#d7b46a',
              borderRadius: '6px',
              color: '#17120a',
              fontWeight: 700,
              padding: '12px 18px',
              textDecoration: 'none',
            }}
          >
            Go to English home
          </Link>
          <Link
            href="/zh"
            style={{
              border: '1px solid #6f675c',
              borderRadius: '6px',
              color: '#f5f2ea',
              fontWeight: 700,
              padding: '12px 18px',
              textDecoration: 'none',
            }}
          >
            前往中文首页
          </Link>
        </div>
      </section>
    </main>
  );
}
