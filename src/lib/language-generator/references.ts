import referenceCatalogFile from './references.json';

export type ReferenceLanguage = {
  id: string;
  name: string;
  group: 'real' | 'user';
  entries: Array<{
    source: string;
    translation: string;
  }>;
};

type ReferenceCatalogFile = {
  sourceUrl: string;
  sourceScriptUrl: string;
  sourceNote: string;
  languages: ReferenceLanguage[];
};

export const REFERENCE_SOURCE_URL = 'https://rollforfantasy.com/tools/language-generator.php';
export const SOURCE_SCRIPT_URL = 'https://rollforfantasy.com/scripts/langGen.js?fgr';

function describeReceivedValue(receivedValue: unknown): string {
  if (typeof receivedValue === 'string') {
    return JSON.stringify(receivedValue);
  }

  if (receivedValue === undefined) {
    return 'undefined';
  }

  if (receivedValue === null) {
    return 'null';
  }

  if (typeof receivedValue === 'number' || typeof receivedValue === 'boolean') {
    return String(receivedValue);
  }

  return Object.prototype.toString.call(receivedValue);
}

function isRecord(receivedValue: unknown): receivedValue is Record<string, unknown> {
  return receivedValue !== null && typeof receivedValue === 'object' && !Array.isArray(receivedValue);
}

function requireRecord(receivedValue: unknown, valuePath: string): Record<string, unknown> {
  if (!isRecord(receivedValue)) {
    throw new Error(
      `Reference catalog ${valuePath} must be an object. Received ${describeReceivedValue(receivedValue)}.`,
    );
  }

  return receivedValue;
}

function requireString(receivedValue: unknown, valuePath: string): string {
  if (typeof receivedValue !== 'string') {
    throw new Error(
      `Reference catalog ${valuePath} must be a string. Received ${describeReceivedValue(receivedValue)}.`,
    );
  }

  return receivedValue;
}

function requireNonEmptyString(receivedValue: unknown, valuePath: string): string {
  const stringValue = requireString(receivedValue, valuePath);
  if (stringValue.trim().length === 0) {
    throw new Error(`Reference catalog ${valuePath} must not be empty. Received ${JSON.stringify(stringValue)}.`);
  }

  return stringValue;
}

function requireReferenceGroup(receivedValue: unknown, valuePath: string): 'real' | 'user' {
  if (receivedValue !== 'real' && receivedValue !== 'user') {
    throw new Error(
      `Reference catalog ${valuePath} must be "real" or "user". Received ${describeReceivedValue(receivedValue)}.`,
    );
  }

  return receivedValue;
}

function requireReferenceEntry(receivedValue: unknown, entryPath: string): { source: string; translation: string } {
  const entryRecord = requireRecord(receivedValue, entryPath);
  return {
    source: requireNonEmptyString(entryRecord.source, `${entryPath}.source`),
    translation: requireString(entryRecord.translation, `${entryPath}.translation`),
  };
}

function requireReferenceLanguage(receivedValue: unknown, languageIndex: number): ReferenceLanguage {
  const languagePath = `languages[${languageIndex}]`;
  const languageRecord = requireRecord(receivedValue, languagePath);
  const entriesValue = languageRecord.entries;

  if (!Array.isArray(entriesValue) || entriesValue.length !== 67) {
    throw new Error(
      `Reference catalog ${languagePath}.entries must contain 67 entries. Received ${describeReceivedValue(entriesValue)}.`,
    );
  }

  return {
    id: requireNonEmptyString(languageRecord.id, `${languagePath}.id`),
    name: requireNonEmptyString(languageRecord.name, `${languagePath}.name`),
    group: requireReferenceGroup(languageRecord.group, `${languagePath}.group`),
    entries: entriesValue.map((entryValue, entryIndex) =>
      requireReferenceEntry(entryValue, `${languagePath}.entries[${entryIndex}]`),
    ),
  };
}

function requireReferenceCatalog(receivedValue: unknown): ReferenceCatalogFile {
  const catalogRecord = requireRecord(receivedValue, 'root');
  const languageValues = catalogRecord.languages;

  if (!Array.isArray(languageValues) || languageValues.length !== 46) {
    throw new Error(
      `Reference catalog languages must contain 46 languages. Received ${describeReceivedValue(languageValues)}.`,
    );
  }

  const languages = languageValues.map((languageValue, languageIndex) =>
    requireReferenceLanguage(languageValue, languageIndex),
  );
  const languageIds = new Set<string>();
  for (const language of languages) {
    if (languageIds.has(language.id)) {
      throw new Error(`Reference catalog contains duplicate language id ${JSON.stringify(language.id)}.`);
    }
    languageIds.add(language.id);
  }

  const realLanguageCount = languages.filter((language) => language.group === 'real').length;
  const userLanguageCount = languages.filter((language) => language.group === 'user').length;
  if (realLanguageCount !== 36 || userLanguageCount !== 10) {
    throw new Error(
      `Reference catalog groups must contain real=36 and user=10 languages. Received real=${realLanguageCount}, user=${userLanguageCount}.`,
    );
  }

  const sourceUrl = requireNonEmptyString(catalogRecord.sourceUrl, 'sourceUrl');
  if (sourceUrl !== REFERENCE_SOURCE_URL) {
    throw new Error(
      `Reference catalog sourceUrl must equal ${JSON.stringify(REFERENCE_SOURCE_URL)}. Received ${JSON.stringify(sourceUrl)}.`,
    );
  }

  const sourceScriptUrl = requireNonEmptyString(catalogRecord.sourceScriptUrl, 'sourceScriptUrl');
  if (sourceScriptUrl !== SOURCE_SCRIPT_URL) {
    throw new Error(
      `Reference catalog sourceScriptUrl must equal ${JSON.stringify(SOURCE_SCRIPT_URL)}. Received ${JSON.stringify(sourceScriptUrl)}.`,
    );
  }

  return {
    sourceUrl,
    sourceScriptUrl,
    sourceNote: requireNonEmptyString(catalogRecord.sourceNote, 'sourceNote'),
    languages,
  };
}

const validatedReferenceCatalog = requireReferenceCatalog(referenceCatalogFile as unknown);

export const REFERENCE_SOURCE_NOTE = validatedReferenceCatalog.sourceNote;
export const REFERENCE_LANGUAGES: ReferenceLanguage[] = validatedReferenceCatalog.languages;

export function getReferenceLanguage(id: string): ReferenceLanguage {
  if (typeof id !== 'string') {
    throw new Error(`Reference language id must be a string. Received ${describeReceivedValue(id)}.`);
  }

  const language = REFERENCE_LANGUAGES.find((referenceLanguage) => referenceLanguage.id === id);
  if (language === undefined) {
    throw new Error(`Unknown reference language id ${JSON.stringify(id)}.`);
  }

  return language;
}
