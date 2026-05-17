interface ServerEnv {
  RESEND_API_KEY: string;
  RESEND_FROM_EMAIL: string;
  CONTACT_TO_EMAIL: string;
  CONTACT_SUBJECT_PREFIX: string;
}

interface PublicEnv {
  NEXT_PUBLIC_GA_MEASUREMENT_ID: string;
  NEXT_PUBLIC_SITE_URL: string;
}

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function optionalEnv(key: string, fallback: string): string {
  return process.env[key] || fallback;
}

let cachedServerEnv: ServerEnv | null = null;

export function getServerEnv(): ServerEnv {
  if (cachedServerEnv) return cachedServerEnv;

  cachedServerEnv = {
    RESEND_API_KEY: requireEnv('RESEND_API_KEY'),
    RESEND_FROM_EMAIL: requireEnv('RESEND_FROM_EMAIL'),
    CONTACT_TO_EMAIL: requireEnv('CONTACT_TO_EMAIL'),
    CONTACT_SUBJECT_PREFIX: optionalEnv('CONTACT_SUBJECT_PREFIX', 'Token Maker contact'),
  };

  return cachedServerEnv;
}

let cachedPublicEnv: PublicEnv | null = null;

export function getPublicEnv(): PublicEnv {
  if (cachedPublicEnv) return cachedPublicEnv;

  cachedPublicEnv = {
    NEXT_PUBLIC_GA_MEASUREMENT_ID: optionalEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', ''),
    NEXT_PUBLIC_SITE_URL: optionalEnv('NEXT_PUBLIC_SITE_URL', 'https://www.tokenmaker.one'),
  };

  return cachedPublicEnv;
}
