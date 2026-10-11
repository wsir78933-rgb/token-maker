export function describeReceivedValue(value: unknown): string {
  if (typeof value === 'string') {
    return JSON.stringify(value);
  }

  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value);
  }

  if (value === undefined) {
    return 'undefined';
  }

  if (value === null) {
    return 'null';
  }

  try {
    const serialized = JSON.stringify(value);
    return typeof serialized === 'string' ? serialized : Object.prototype.toString.call(value);
  } catch (serializationError: unknown) {
    if (serializationError instanceof Error && serializationError.message.length > 0) {
      return `${Object.prototype.toString.call(value)} (serialization failed: ${serializationError.message})`;
    }

    throw serializationError;
  }
}
