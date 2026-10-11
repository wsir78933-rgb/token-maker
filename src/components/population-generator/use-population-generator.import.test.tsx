// @vitest-environment jsdom

import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { generatePopulation, serializePopulationResult } from '@/lib/population-generator';

import {
  usePopulationGenerator,
  type PopulationGeneratorReadySession,
  type PopulationGeneratorSession,
} from './use-population-generator';

const capturedFileFailures = vi.hoisted(() => ({
  errors: [] as unknown[],
}));

vi.mock('./population-known-errors', async () => {
  const actual = await vi.importActual<typeof import('./population-known-errors')>(
    './population-known-errors',
  );

  return {
    ...actual,
    rethrowUnknownPopulationFileReadFailure: (error: unknown): never => {
      capturedFileFailures.errors.push(error);
      return undefined as never;
    },
  };
});

interface DeferredArrayBuffer {
  promise: Promise<ArrayBuffer>;
  resolve: (bytes: ArrayBuffer) => void;
}

function deferArrayBuffer(): DeferredArrayBuffer {
  let resolveBytes: ((bytes: ArrayBuffer) => void) | null = null;
  const promise = new Promise<ArrayBuffer>((resolve) => {
    resolveBytes = resolve;
  });

  return {
    promise,
    resolve: (bytes) => {
      if (resolveBytes === null) {
        throw new Error('Deferred population file bytes resolved before the reader was installed.');
      }

      resolveBytes(bytes);
    },
  };
}

function populationFileWithRead(read: () => Promise<ArrayBuffer>): File {
  return {
    arrayBuffer: () => read(),
  } as File;
}

function populationTextBytes(text: string): ArrayBuffer {
  const encoded = new TextEncoder().encode(text);
  return encoded.buffer.slice(encoded.byteOffset, encoded.byteOffset + encoded.byteLength);
}

function importedPopulationBytes(name: string): ArrayBuffer {
  const generated = generatePopulation({
    era: 'medieval',
    size: 'village',
    locale: 'en',
    random: () => 0.2,
  });
  const renamed = structuredClone(generated);
  renamed.name = name;
  return populationTextBytes(serializePopulationResult(renamed));
}

function readySession(session: PopulationGeneratorSession): PopulationGeneratorReadySession {
  if (session.status !== 'ready') {
    throw new Error(`Population session must be ready. Received ${session.status}.`);
  }

  return session;
}

afterEach(() => {
  cleanup();
  capturedFileFailures.errors = [];
});

describe('population text import while a read is pending', () => {
  it('asks before replacing an edit made in the same turn as the delayed read', async () => {
    const deferred = deferArrayBuffer();
    const { result } = renderHook(() => usePopulationGenerator('en'));
    const before = readySession(result.current);
    const keptName = 'Kept During Read';
    const populationBefore = before.result.population.value;

    await act(async () => {
      before.importSelectedFile(populationFileWithRead(() => deferred.promise));
    });

    const reading = readySession(result.current);
    expect(reading.fileNotice).toEqual({ kind: 'reading' });
    expect(reading.result.name).toBe(before.result.name);

    await act(async () => {
      reading.changeText({ kind: 'name' }, keptName);
      deferred.resolve(importedPopulationBytes('Imported Overwrite'));
      await deferred.promise;
    });

    const prompted = readySession(result.current);
    expect(prompted.dialog).toMatchObject({
      kind: 'confirm',
      request: { kind: 'import', result: expect.objectContaining({ name: 'Imported Overwrite' }) },
    });
    expect(prompted.result.name).toBe(keptName);
    expect(prompted.result.population.value).toBe(populationBefore);
    expect(prompted.fileNotice).toEqual({ kind: 'idle' });
    expect(prompted.result.professions).toHaveLength(170);

    await act(async () => {
      prompted.cancelDialog();
    });

    const cancelled = readySession(result.current);
    expect(cancelled.dialog).toEqual({ kind: 'closed' });
    expect(cancelled.result.name).toBe(keptName);
    expect(cancelled.result.population.value).toBe(populationBefore);
    expect(cancelled.result.era).toBe(before.result.era);
    expect(cancelled.result.size).toBe(before.result.size);
    expect(cancelled.selectedEra).toBe(before.result.era);
    expect(cancelled.selectedSize).toBe(before.result.size);
  });

  it('asks before replacing a number draft made while the file is still reading', async () => {
    const deferred = deferArrayBuffer();
    const { result } = renderHook(() => usePopulationGenerator('en'));
    const before = readySession(result.current);

    await act(async () => {
      before.importSelectedFile(populationFileWithRead(() => deferred.promise));
    });

    const reading = readySession(result.current);
    await act(async () => {
      reading.changeNumber({ kind: 'stat-value', stat: 'population' }, '12abc');
      deferred.resolve(importedPopulationBytes('Imported Overwrite'));
      await deferred.promise;
    });

    const prompted = readySession(result.current);
    expect(prompted.dialog.kind).toBe('confirm');
    expect(prompted.numberValue({ kind: 'stat-value', stat: 'population' })).toBe('12abc');
    expect(prompted.numberError({ kind: 'stat-value', stat: 'population' })).toBe('Enter a non-negative integer');
    expect(prompted.result.population.value).toBe(before.result.population.value);

    await act(async () => {
      prompted.cancelDialog();
    });

    const cancelled = readySession(result.current);
    expect(cancelled.dialog).toEqual({ kind: 'closed' });
    expect(cancelled.numberValue({ kind: 'stat-value', stat: 'population' })).toBe('12abc');
    expect(cancelled.result.population.value).toBe(before.result.population.value);
    expect(cancelled.result.name).toBe(before.result.name);
  });

  it('imports a clean result when nothing changed during the delayed read', async () => {
    const deferred = deferArrayBuffer();
    const { result } = renderHook(() => usePopulationGenerator('en'));
    const before = readySession(result.current);

    await act(async () => {
      before.importSelectedFile(populationFileWithRead(() => deferred.promise));
    });

    await act(async () => {
      deferred.resolve(importedPopulationBytes('Imported Clean'));
      await deferred.promise;
    });

    const imported = readySession(result.current);
    expect(imported.dialog).toEqual({ kind: 'closed' });
    expect(imported.result.name).toBe('Imported Clean');
    expect(imported.fileNotice).toEqual({ kind: 'success', message: 'Import succeeded' });
    expect(imported.dirty).toBe(false);
    expect(imported.result.professions).toHaveLength(170);
    expect(imported.result.name).not.toBe(before.result.name);
  });

  it('shows the DOMException and keeps the current result when the file read fails', async () => {
    const readError = new DOMException('The file could not be read.', 'NotReadableError');
    const { result } = renderHook(() => usePopulationGenerator('en'));
    const before = readySession(result.current);

    await act(async () => {
      before.importSelectedFile(populationFileWithRead(() => Promise.reject(readError)));
    });

    const failed = readySession(result.current);
    expect(failed.fileNotice).toEqual({
      kind: 'error',
      message: 'Import failed: NotReadableError: The file could not be read.',
    });
    expect(failed.dialog).toEqual({ kind: 'closed' });
    expect(failed.result.name).toBe(before.result.name);
    expect(failed.result.population.value).toBe(before.result.population.value);
    expect(capturedFileFailures.errors).toEqual([]);
  });

  it('rethrows an unknown file read failure without turning it into an import notice', async () => {
    const unexpected = new TypeError('population file sector 9 is not a DOMException');
    const { result } = renderHook(() => usePopulationGenerator('en'));
    const before = readySession(result.current);

    await act(async () => {
      before.importSelectedFile(populationFileWithRead(() => Promise.reject(unexpected)));
    });
    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
    });

    const failed = readySession(result.current);
    expect(capturedFileFailures.errors).toEqual([unexpected]);
    expect(failed.fileNotice).toEqual({ kind: 'reading' });
    expect(failed.result.name).toBe(before.result.name);
    expect(failed.dialog).toEqual({ kind: 'closed' });
  });
});
