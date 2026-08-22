'use client';

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import {
  createCoatIdentity,
  generateCoatNames,
  nameGeneratorTypes,
  type NameGeneratorLanguage,
  type NameGeneratorType,
} from '@/lib/coat-of-arms/name-generator';
import type { CoatLocale } from '@/lib/coat-of-arms/types';
import { usePanelCommandError } from './usePanelCommandError';
import { getCoatWorkbenchCopy } from './workbench-copy';

/** Generates a list of local names while keeping project identity mutations secondary. */
export function NamePanel({ locale }: { locale: CoatLocale }) {
  const copy = getCoatWorkbenchCopy(locale).panels;
  const [selectedType, setSelectedType] = useState<NameGeneratorType>('city');
  const [language, setLanguage] = useState<NameGeneratorLanguage>('en');
  const [generatedNames, setGeneratedNames] = useState(() => generateCoatNames('city', 'en'));
  const [identity, setIdentity] = useState(() => createCoatIdentity(locale));
  const { error, run } = usePanelCommandError(locale);

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

  const selectedTypeName = copy.nameGeneratorTypes[selectedType];

  return (
    <section aria-label={copy.names} className="coat-target-utility-form coat-target-name-form">
      <h2 style={{ marginBottom: 0 }}>{copy.names}</h2>
      {error ? <p role="alert">{error}</p> : null}
      <div className="coat-target-form-fieldset-controls" style={{ gridTemplateColumns: 'minmax(0, 1fr) minmax(0, auto)' }}>
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
        <h3>{copy.nameResults}</h3>
        <ol>
          {generatedNames.map((name) => <li key={name}>{name}</li>)}
        </ol>
      </section>
      <section aria-label={copy.identityActions} className="coat-target-utility-output">
        <h3>{copy.identityActions}</h3>
        <p><span>{copy.generatedProjectName}: </span><strong>{identity.projectName}</strong></p>
        <p><span>{copy.generatedMotto}: </span><strong>{identity.motto}</strong></p>
        <div className="coat-target-form-actions">
          <button className="coat-target-action-button" type="button" onClick={() => setIdentity(createCoatIdentity(locale))}>{copy.generateIdentity}</button>
          <button className="coat-target-action-button" type="button" onClick={() => run({ type: 'set-project-name', name: identity.projectName })}>{copy.useProjectName}</button>
          <button className="coat-target-action-button" type="button" onClick={() => run({
            type: 'add-text-layer', text: identity.motto, color: '#1E293B', fontSize: 10,
            alignment: 'center', path: { mode: 'motto', curve: 'upper' },
          })}>{copy.addGeneratedMotto}</button>
        </div>
      </section>
    </section>
  );
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
