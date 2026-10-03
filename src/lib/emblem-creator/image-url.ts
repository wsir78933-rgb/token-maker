const EMBLEM_URL_BASE = 'https://emblem-creator.invalid';

export function requireEmblemImageUrl(value: string): string {
  if (typeof value !== 'string') {
    throw new TypeError('Emblem image URL must be a string; received ' + describeUrlValue(value));
  }

  if (value.length === 0 || value.trim() !== value) {
    throw new TypeError('Emblem image URL must be non-empty and have no surrounding whitespace; received ' + JSON.stringify(value));
  }

  if (value.startsWith('/')) {
    if (value.startsWith('//')) {
      throw new TypeError('Emblem image URL must be a same-origin root path, not a protocol-relative URL; received ' + JSON.stringify(value));
    }

    let rootPathUrl: URL;
    try {
      rootPathUrl = new URL(value, EMBLEM_URL_BASE);
    } catch (error) {
      if (error instanceof TypeError) {
        throw new TypeError('Invalid same-origin emblem image URL ' + JSON.stringify(value) + ': ' + error.message);
      }
      throw error;
    }

    if (rootPathUrl.origin !== EMBLEM_URL_BASE) {
      throw new TypeError('Emblem image URL must stay on the same origin; received ' + JSON.stringify(value));
    }
    return value;
  }

  let absoluteUrl: URL;
  try {
    absoluteUrl = new URL(value);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new TypeError('Invalid absolute emblem image URL ' + JSON.stringify(value) + ': ' + error.message);
    }
    throw error;
  }

  if (absoluteUrl.protocol !== 'http:' && absoluteUrl.protocol !== 'https:') {
    throw new TypeError('Emblem image URL must use http: or https:; received ' + JSON.stringify(value));
  }

  if (!/^https?:\/\/[^/\\?#]/i.test(value)) {
    throw new TypeError('Emblem image URL must include an explicit http:// or https:// authority; received ' + JSON.stringify(value));
  }

  if (absoluteUrl.hostname.length === 0) {
    throw new TypeError('Emblem image URL must include a host; received ' + JSON.stringify(value));
  }

  return value;
}

function describeUrlValue(value: unknown): string {
  if (typeof value === 'string') {
    return JSON.stringify(value);
  }

  if (value === null || typeof value !== 'object') {
    return String(value);
  }

  try {
    const serializedValue = JSON.stringify(value);
    return serializedValue === undefined ? Object.prototype.toString.call(value) : serializedValue;
  } catch (error) {
    if (error instanceof TypeError) {
      return '[unserializable value: ' + error.message + ']';
    }
    throw error;
  }
}
