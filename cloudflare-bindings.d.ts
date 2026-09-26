// Import binding types without adding the Worker runtime's globals to the DOM.
type R2Bucket = import('@cloudflare/workers-types').R2Bucket;
type RateLimit = import('@cloudflare/workers-types').RateLimit;
type Fetcher = import('@cloudflare/workers-types').Fetcher;

// The application only imports env from this runtime module.
declare module 'cloudflare:workers' {
  export const env: Cloudflare.Env;
}
