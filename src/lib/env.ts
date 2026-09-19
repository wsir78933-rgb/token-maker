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

function serializeReceivedValue(value: unknown) {
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'number' || typeof value === 'boolean' || value === null) {
    return JSON.stringify(value);
  }
  if (value === undefined) return 'undefined';
  return String(value);
}

function readRequiredEnvString(source: object, key: string): string {
  const value = Reflect.get(source, key);
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(
      `Missing required environment variable: ${key}; received ${serializeReceivedValue(value)}`,
    );
  }

  return value.trim();
}

function readOptionalEnvString(source: object, key: string, fallback: string): string {
  const value = Reflect.get(source, key);
  if (value === undefined || value === '') {
    return fallback;
  }

  if (typeof value !== 'string') {
    throw new Error(
      `Environment variable ${key} must be a string; received ${serializeReceivedValue(value)}`,
    );
  }

  return value.trim() || fallback;
}

function optionalEnv(key: string, fallback: string): string {
  return process.env[key] || fallback;
}

export function getServerEnv(source: object = process.env): ServerEnv {
  return {
    RESEND_API_KEY: readRequiredEnvString(source, 'RESEND_API_KEY'),
    RESEND_FROM_EMAIL: readRequiredEnvString(source, 'RESEND_FROM_EMAIL'),
    CONTACT_TO_EMAIL: readRequiredEnvString(source, 'CONTACT_TO_EMAIL'),
    CONTACT_SUBJECT_PREFIX: readOptionalEnvString(
      source,
      'CONTACT_SUBJECT_PREFIX',
      'Token Maker contact',
    ),
  };
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
