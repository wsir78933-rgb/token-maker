export type LanguageRulePair = {
  source: string;
  target: string;
};

export type LanguageRules = {
  characters: LanguageRulePair[];
  combinations: LanguageRulePair[];
};

export type VocabularyItem = {
  id: string;
  category: string;
  source: string;
};
