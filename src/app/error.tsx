'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface RouteErrorPageProps {
  error: Error & { digest?: string };
  retry: () => void;
}

export default function RouteErrorPage({ error, retry }: RouteErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[60vh] items-center justify-center px-6 py-16">
      <section className="w-full max-w-xl rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Token Maker</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">We could not load this page</h1>
        <p className="mt-3 text-muted-foreground">Please try again. If the problem continues, return to the homepage.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            type="button"
            onClick={retry}
          >
            Try again
          </button>
          <Link
            className="rounded-md border border-border px-4 py-2 font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            href="/"
          >
            Go to homepage
          </Link>
        </div>
      </section>
    </main>
  );
}
