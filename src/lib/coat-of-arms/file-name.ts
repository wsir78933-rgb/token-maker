/** Produces a browser-safe local filename stem without path or control characters. */
export function sanitizeCoatFileBaseName(name: string): string {
  const sanitizedName = name
    .trim()
    .replace(/[\\/:*?"<>|\u0000-\u001F]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/^\.+/, '')
    .slice(0, 80)
    .trim();
  return sanitizedName || 'coat-of-arms';
}
