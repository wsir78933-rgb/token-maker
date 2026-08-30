// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CoatExportUploadError, uploadCoatExportToCloud } from './client-upload';

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function createExportFileBlob(contents = 'coat-export-bytes'): Blob {
  return new Blob([contents], { type: 'image/png' });
}

describe('uploadCoatExportToCloud', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('POSTs /api/coat-export with raw base64 file and does not return a URL', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ ok: true, imageUrl: 'https://r2.example/coats/abc.png' }));
    const file = createExportFileBlob('hello-coat');

    const uploadResult = await uploadCoatExportToCloud({
      file,
      fileType: 'png',
      width: 1024,
      height: 614,
      locale: 'en',
    });

    expect(uploadResult).toBeUndefined();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith('/api/coat-export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: expect.any(String),
    });

    const request = fetchMock.mock.calls[0]?.[1] as { body: string };
    const payload = JSON.parse(request.body) as {
      file: string;
      fileType: string;
      width: number;
      height: number;
      locale: string;
    };
    expect(payload).toEqual({
      file: expect.any(String),
      fileType: 'png',
      width: 1024,
      height: 614,
      locale: 'en',
    });
    expect(payload.file.startsWith('data:')).toBe(false);
    expect(payload.file).not.toContain('https://');
    expect(atob(payload.file)).toBe('hello-coat');
  });

  it('keeps jpeg as the JSON fileType and sends jpg bytes without a data: prefix', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ ok: true }));
    const file = new Blob(['jpeg-bytes'], { type: 'image/jpeg' });

    await uploadCoatExportToCloud({
      file,
      fileType: 'jpeg',
      width: 512,
      height: 307,
      locale: 'zh',
    });

    const request = fetchMock.mock.calls[0]?.[1] as { body: string };
    const payload = JSON.parse(request.body) as { file: string; fileType: string; locale: string };
    expect(payload.fileType).toBe('jpeg');
    expect(payload.locale).toBe('zh');
    expect(payload.file.startsWith('data:')).toBe(false);
    expect(atob(payload.file)).toBe('jpeg-bytes');
  });

  it('normalizes missing or non-zh locale to en', async () => {
    fetchMock.mockImplementation(async () => jsonResponse({ ok: true }));

    await uploadCoatExportToCloud({
      file: createExportFileBlob(),
      fileType: 'pdf',
      width: 256,
      height: 154,
    });
    await uploadCoatExportToCloud({
      file: createExportFileBlob(),
      fileType: 'pdf',
      width: 256,
      height: 154,
      locale: 'de',
    });

    const firstPayload = JSON.parse((fetchMock.mock.calls[0]?.[1] as { body: string }).body) as {
      locale: string;
    };
    const secondPayload = JSON.parse((fetchMock.mock.calls[1]?.[1] as { body: string }).body) as {
      locale: string;
    };
    expect(firstPayload.locale).toBe('en');
    expect(secondPayload.locale).toBe('en');
  });

  it('maps known API error codes onto CoatExportUploadError', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ error: 'file_too_large' }, 413));

    try {
      await uploadCoatExportToCloud({
        file: createExportFileBlob(),
        fileType: 'png',
        width: 1024,
        height: 614,
        locale: 'en',
      });
      throw new Error('expected CoatExportUploadError');
    } catch (caught) {
      expect(caught).toBeInstanceOf(CoatExportUploadError);
      expect(caught).toMatchObject({
        name: 'CoatExportUploadError',
        code: 'file_too_large',
        status: 413,
      });
    }
  });

  it('maps invalid_file, rate_limited, and storage_not_configured from the API', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ error: 'invalid_file' }, 400))
      .mockResolvedValueOnce(jsonResponse({ error: 'rate_limited' }, 429))
      .mockResolvedValueOnce(jsonResponse({ error: 'storage_not_configured' }, 503));

    await expect(
      uploadCoatExportToCloud({
        file: createExportFileBlob(),
        fileType: 'png',
        width: 1024,
        height: 614,
      })
    ).rejects.toMatchObject({ code: 'invalid_file', status: 400 });
    await expect(
      uploadCoatExportToCloud({
        file: createExportFileBlob(),
        fileType: 'png',
        width: 1024,
        height: 614,
      })
    ).rejects.toMatchObject({ code: 'rate_limited', status: 429 });
    await expect(
      uploadCoatExportToCloud({
        file: createExportFileBlob(),
        fileType: 'png',
        width: 1024,
        height: 614,
      })
    ).rejects.toMatchObject({ code: 'storage_not_configured', status: 503 });
  });

  it('treats a successful HTTP response without ok:true as unknown_error', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ id: 'abc', imageUrl: 'https://r2.example/x.png' }));

    await expect(
      uploadCoatExportToCloud({
        file: createExportFileBlob(),
        fileType: 'png',
        width: 1024,
        height: 614,
      })
    ).rejects.toMatchObject({ code: 'unknown_error', status: 200 });
  });

  it('throws network_error when fetch itself fails', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('Failed to parse URL from /api/coat-export'));

    await expect(
      uploadCoatExportToCloud({
        file: createExportFileBlob(),
        fileType: 'png',
        width: 1024,
        height: 614,
      })
    ).rejects.toMatchObject({ name: 'CoatExportUploadError', code: 'network_error' });
  });

  it('fails fast on an invalid file type and includes the actual value', async () => {
    await expect(
      uploadCoatExportToCloud({
        file: createExportFileBlob(),
        fileType: 'jpg' as 'png',
        width: 1024,
        height: 614,
      })
    ).rejects.toThrow(/jpg/);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('fails fast on non-positive integer dimensions and includes the actual value', async () => {
    await expect(
      uploadCoatExportToCloud({
        file: createExportFileBlob(),
        fileType: 'png',
        width: 0,
        height: 614,
      })
    ).rejects.toThrow('Invalid coat export width: 0');
    await expect(
      uploadCoatExportToCloud({
        file: createExportFileBlob(),
        fileType: 'png',
        width: 1024,
        height: -1,
      })
    ).rejects.toThrow('Invalid coat export height: -1');
    await expect(
      uploadCoatExportToCloud({
        file: createExportFileBlob(),
        fileType: 'png',
        width: 1024.5,
        height: 614,
      })
    ).rejects.toThrow('Invalid coat export width: 1024.5');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('fails fast when max(width, height) is not an allowed longest edge', async () => {
    await expect(
      uploadCoatExportToCloud({
        file: createExportFileBlob(),
        fileType: 'png',
        width: 1080,
        height: 648,
      })
    ).rejects.toThrow('Invalid coat export longest edge: 1080');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('fails fast on an empty file blob', async () => {
    await expect(
      uploadCoatExportToCloud({
        file: new Blob([], { type: 'image/png' }),
        fileType: 'png',
        width: 1024,
        height: 614,
      })
    ).rejects.toThrow('Coat export file is empty; received 0 bytes');
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
