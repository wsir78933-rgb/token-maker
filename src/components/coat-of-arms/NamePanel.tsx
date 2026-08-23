'use client';

import { useState } from 'react';
import { Clipboard, RefreshCw } from 'lucide-react';
import {
  generateCoatNames,
  nameGeneratorTypes,
  type NameGeneratorLanguage,
  type NameGeneratorType,
} from '@/lib/coat-of-arms/name-generator';
import type { CoatLocale } from '@/lib/coat-of-arms/types';
import { getCoatWorkbenchCopy } from './workbench-copy';

/** Generates local names, copies them to the clipboard, and keeps a saved-name list. */
export function NamePanel({ locale }: { locale: CoatLocale }) {
  const copy = getCoatWorkbenchCopy(locale).panels;
  const [selectedType, setSelectedType] = useState<NameGeneratorType>('city');
  const [language, setLanguage] = useState<NameGeneratorLanguage>('en');
  const [generatedNames, setGeneratedNames] = useState<string[]>([]);
  const [savedNames, setSavedNames] = useState<string[]>([]);
  const [copyError, setCopyError] = useState<string | null>(null);
  const [copiedNotice, setCopiedNotice] = useState<string | null>(null);

  const changeGeneratorType = (value: string) => {
    assertNameGeneratorTypeValue(value);
    setSelectedType(value);
  };

  const changeGeneratorLanguage = (value: string) => {
    assertNameGeneratorLanguageValue(value);
    setLanguage(value);
  };

  const generateNames = () => {
    setGeneratedNames(generateCoatNames(selectedType, language));
  };

  const copyGeneratedName = async (name: string) => {
    try {
      await writeGeneratedNameToClipboard(name);
    } catch (caught) {
      setCopiedNotice(null);
      setCopyError(copy.commandFailed(caught instanceof Error ? caught.message : String(caught)));
      return;
    }
    setCopyError(null);
    setCopiedNotice(copy.nameCopied(name));
    setSavedNames((currentSavedNames) => addSavedNameIfMissing(currentSavedNames, name));
  };

  const removeSavedName = (name: string) => {
    setSavedNames((currentSavedNames) => currentSavedNames.filter((savedName) => savedName !== name));
  };

  const selectedTypeName = copy.nameGeneratorTypes[selectedType];

  return (
    <section aria-label={copy.names} className="coat-target-utility-form coat-target-name-form">
      <h2 style={{ marginBottom: 0 }}>{copy.names}</h2>
      {copyError ? <p role="alert">{copyError}</p> : null}
      {copiedNotice ? <p role="status">{copiedNotice}</p> : null}
      <div className="coat-target-form-fieldset-controls">
        <label className="coat-target-form-field">
          <select aria-label={copy.nameGeneratorType} value={selectedType} onChange={(event) => changeGeneratorType(event.target.value)}>
            {nameGeneratorTypes.map((type) => <option key={type} value={type}>{copy.nameGeneratorTypes[type]}</option>)}
          </select>
        </label>
        <label className="coat-target-form-field">
          <select className="coat-target-name-language" aria-label={copy.nameGeneratorLanguage} value={language} onChange={(event) => changeGeneratorLanguage(event.target.value)}>
            <option value="en">{copy.nameGeneratorLanguages.en}</option>
            <option value="de">{copy.nameGeneratorLanguages.de}</option>
          </select>
        </label>
      </div>
      <button className="coat-target-action-button coat-target-action-button--primary" type="button" onClick={generateNames}>
        <RefreshCw aria-hidden="true" />
        {copy.generateNames(selectedTypeName)}
      </button>
      <section aria-label={copy.nameResults} className="coat-target-utility-output">
        <ol aria-label={copy.nameResults}>
          {generatedNames.map((name) => (
            <li key={name}>
              <span>{name}</span>
              <button
                className="coat-target-name-copy"
                type="button"
                aria-label={copy.copyGeneratedName(name)}
                onClick={() => {
                  void copyGeneratedName(name);
                }}
              >
                <Clipboard aria-hidden="true" />
              </button>
            </li>
          ))}
        </ol>
      </section>
      {savedNames.length > 0 ? (
        <section aria-label={copy.savedNames} className="coat-target-name-saved">
          <h3>{copy.savedNames}</h3>
          <ul>
            {savedNames.map((name) => (
              <li key={name}>
                <span>{name}</span>
                <button type="button" aria-label={copy.removeSavedName(name)} onClick={() => removeSavedName(name)}>×</button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </section>
  );
}

async function writeGeneratedNameToClipboard(name: string): Promise<void> {
  assertCopyableName(name);
  const clipboard = globalThis.navigator?.clipboard;
  if (!clipboard || typeof clipboard.writeText !== 'function') {
    throw new Error(`Clipboard copy is unavailable for name: ${name}`);
  }
  try {
    await clipboard.writeText(name);
  } catch (caught) {
    const reason = caught instanceof Error ? caught.message : String(caught);
    throw new Error(`Failed to copy name ${name}: ${reason}`);
  }
}

function addSavedNameIfMissing(currentSavedNames: readonly string[], name: string): string[] {
  return currentSavedNames.includes(name) ? [...currentSavedNames] : [...currentSavedNames, name];
}

function assertCopyableName(name: unknown): asserts name is string {
  if (typeof name !== 'string' || name.length === 0) {
    throw new Error(`Invalid generated name: ${String(name)}`);
  }
}

function assertNameGeneratorTypeValue(value: string): asserts value is NameGeneratorType {
  if (!nameGeneratorTypes.includes(value as NameGeneratorType)) {
    throw new Error(`Invalid name generator type: ${value}`);
  }
}

function assertNameGeneratorLanguageValue(value: string): asserts value is NameGeneratorLanguage {
  if (value !== 'en' && value !== 'de') {
    throw new Error(`Invalid name generator language: ${value}`);
  }
}
