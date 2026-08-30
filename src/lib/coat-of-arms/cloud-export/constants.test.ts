import { describe, expect, it } from 'vitest';
import {
  COAT_EXPORT_CACHE_CONTROL,
  COAT_EXPORT_ID_LENGTH,
  COAT_EXPORT_LONGEST_EDGES,
  COAT_EXPORT_MAX_FILE_BYTES,
  COAT_EXPORT_MAX_REQUEST_BODY_BYTES,
  COAT_EXPORT_OBJECT_PREFIX,
  assertCoatCloudExportFileType,
  getCoatExportContentType,
  getCoatExportObjectExtension,
  getCoatExportObjectKey,
  isCoatExportLongestEdge,
  type CoatCloudExportFileType,
} from './constants';

describe('coat cloud export constants', () => {
  it('defines frozen export constants', () => {
    expect(COAT_EXPORT_OBJECT_PREFIX).toBe('coats');
    expect(COAT_EXPORT_ID_LENGTH).toBe(10);
    expect(COAT_EXPORT_MAX_FILE_BYTES).toBe(5 * 1024 * 1024);
    expect(COAT_EXPORT_MAX_REQUEST_BODY_BYTES).toBe(8 * 1024 * 1024);
    expect(COAT_EXPORT_CACHE_CONTROL).toBe('public, max-age=2592000, immutable');
    expect(COAT_EXPORT_LONGEST_EDGES).toEqual([256, 512, 1024, 2048]);
  });

  describe('assertCoatCloudExportFileType', () => {
    it('accepts valid file types', () => {
      expect(() => assertCoatCloudExportFileType('png')).not.toThrow();
      expect(() => assertCoatCloudExportFileType('jpeg')).not.toThrow();
      expect(() => assertCoatCloudExportFileType('pdf')).not.toThrow();
    });

    it('throws on invalid file types and includes the actual value in the message', () => {
      expect(() => assertCoatCloudExportFileType('webp')).toThrowError(/webp/);
      expect(() => assertCoatCloudExportFileType('jpg')).toThrowError(/jpg/);
      expect(() => assertCoatCloudExportFileType('')).toThrowError(/Invalid coat cloud export file type/);
      expect(() => assertCoatCloudExportFileType(null)).toThrowError(/null/);
      expect(() => assertCoatCloudExportFileType(undefined)).toThrowError(/undefined/);
      expect(() => assertCoatCloudExportFileType(123)).toThrowError(/123/);
    });
  });

  describe('isCoatExportLongestEdge', () => {
    it('returns true for valid longest edge sizes', () => {
      expect(isCoatExportLongestEdge(256)).toBe(true);
      expect(isCoatExportLongestEdge(512)).toBe(true);
      expect(isCoatExportLongestEdge(1024)).toBe(true);
      expect(isCoatExportLongestEdge(2048)).toBe(true);
    });

    it('returns false for invalid longest edge values', () => {
      expect(isCoatExportLongestEdge(128)).toBe(false);
      expect(isCoatExportLongestEdge(500)).toBe(false);
      expect(isCoatExportLongestEdge('512')).toBe(false);
      expect(isCoatExportLongestEdge(null)).toBe(false);
      expect(isCoatExportLongestEdge(undefined)).toBe(false);
    });
  });

  describe('getCoatExportObjectExtension', () => {
    it('maps valid file types to object extensions (jpeg -> jpg)', () => {
      expect(getCoatExportObjectExtension('png')).toBe('png');
      expect(getCoatExportObjectExtension('jpeg')).toBe('jpg');
      expect(getCoatExportObjectExtension('pdf')).toBe('pdf');
    });

    it('throws on invalid file type and includes the actual value', () => {
      expect(() =>
        getCoatExportObjectExtension('svg' as unknown as CoatCloudExportFileType)
      ).toThrowError(/svg/);
    });
  });

  describe('getCoatExportContentType', () => {
    it('returns corresponding MIME content types', () => {
      expect(getCoatExportContentType('png')).toBe('image/png');
      expect(getCoatExportContentType('jpeg')).toBe('image/jpeg');
      expect(getCoatExportContentType('pdf')).toBe('application/pdf');
    });

    it('throws on invalid file type and includes the actual value', () => {
      expect(() =>
        getCoatExportContentType('svg' as unknown as CoatCloudExportFileType)
      ).toThrowError(/svg/);
    });
  });

  describe('getCoatExportObjectKey', () => {
    it('returns coats/{id}.{ext} for valid ids and file types', () => {
      expect(getCoatExportObjectKey('0123456789', 'png')).toBe('coats/0123456789.png');
      expect(getCoatExportObjectKey('abcdefghij', 'jpeg')).toBe('coats/abcdefghij.jpg');
      expect(getCoatExportObjectKey('AbCdEfGh12', 'pdf')).toBe('coats/AbCdEfGh12.pdf');
    });

    it('normalizes id with leading/trailing whitespace when trimmed length is 10', () => {
      expect(getCoatExportObjectKey('  0123456789  ', 'png')).toBe('coats/0123456789.png');
    });

    it('throws on empty or whitespace-only id and includes the actual value', () => {
      expect(() => getCoatExportObjectKey('', 'png')).toThrowError(/Invalid coat export id: ""/);
      expect(() => getCoatExportObjectKey('   ', 'png')).toThrowError(/Invalid coat export id: "   "/);
    });

    it('throws on wrong length id and includes the actual value', () => {
      expect(() => getCoatExportObjectKey('short', 'png')).toThrowError(/short/);
      expect(() => getCoatExportObjectKey('toolongidentifier', 'png')).toThrowError(
        /toolongidentifier/
      );
    });

    it('throws on non-string id and includes the actual value', () => {
      expect(() =>
        getCoatExportObjectKey(null as unknown as string, 'png')
      ).toThrowError(/null/);
      expect(() =>
        getCoatExportObjectKey(undefined as unknown as string, 'png')
      ).toThrowError(/undefined/);
    });
  });
});
