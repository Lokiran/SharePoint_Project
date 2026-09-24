import * as liveStrings from 'InventoryManagementWebPartStrings';
import en_us from '../loc/data/en-us';
import pl_pl from '../loc/data/pl-pl';
import sv_se from '../loc/data/sv-se';
import pt_pt from '../loc/data/pt-pt';

export type SupportedLanguage = 'en-us' | 'pl-pl' | 'sv-se' | 'pt-pt';

export interface ILanguageOption {
  code: SupportedLanguage;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: ILanguageOption[] = [
  { code: 'en-us', nativeName: 'English' },
  { code: 'pl-pl', nativeName: 'Polski' },
  { code: 'sv-se', nativeName: 'Svenska' },
  { code: 'pt-pt', nativeName: 'Português' }
];

const LANGUAGE_DATA: Record<SupportedLanguage, IInventoryManagementWebPartStrings> = {
  'en-us': en_us,
  'pl-pl': pl_pl,
  'sv-se': sv_se,
  'pt-pt': pt_pt
};

const STORAGE_KEY = 'inventoryManagement_language';

type Listener = (language: SupportedLanguage) => void;
const listeners: Listener[] = [];

let currentLanguage: SupportedLanguage = 'en-us';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// Mutates `target`'s leaf values in place (never replaces nested objects),
// so every file's `strings.Namespace.Key` reads the update on next render —
// they all share this same singleton module reference.
function mergeInPlace(target: Record<string, unknown>, source: Record<string, unknown>): void {
  Object.keys(source).forEach(key => {
    const sourceValue = source[key];
    const targetValue = target[key];
    if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
      mergeInPlace(targetValue, sourceValue);
    } else {
      target[key] = sourceValue;
    }
  });
}

function readStoredLanguage(): SupportedLanguage | undefined {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && Object.prototype.hasOwnProperty.call(LANGUAGE_DATA, stored)) {
      return stored as SupportedLanguage;
    }
  } catch {
    // localStorage unavailable (private browsing, etc.) — ignore.
  }
  return undefined;
}

export function getCurrentLanguage(): SupportedLanguage {
  return currentLanguage;
}

export function setLanguage(language: SupportedLanguage): void {
  const data = LANGUAGE_DATA[language];
  if (!data) {
    return;
  }

  mergeInPlace(liveStrings as unknown as Record<string, unknown>, data as unknown as Record<string, unknown>);
  currentLanguage = language;

  try {
    window.localStorage.setItem(STORAGE_KEY, language);
  } catch {
    // ignore persistence failures
  }

  listeners.forEach(listener => listener(language));
}

export function onLanguageChange(listener: Listener): () => void {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index >= 0) {
      listeners.splice(index, 1);
    }
  };
}

// Adds keys that exist in `source` but not in `target`, leaving existing values alone.
function fillMissing(target: Record<string, unknown>, source: Record<string, unknown>): void {
  Object.keys(source).forEach(key => {
    const sourceValue = source[key];
    const targetValue = target[key];
    if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
      fillMissing(targetValue, sourceValue);
    } else if (targetValue === undefined) {
      target[key] = isPlainObject(sourceValue) ? { ...sourceValue } : sourceValue;
    }
  });
}

// The AMD strings file is served separately from the bundle and can be stale
// (dev-server watch mode, CDN caching). Backfill from the bundled English data
// so a newly added key never renders as a blank label.
fillMissing(liveStrings as unknown as Record<string, unknown>, en_us as unknown as Record<string, unknown>);

// Applied once, synchronously, at module load — before React ever renders —
// so a returning visitor's saved choice appears with no language flash.
const stored = readStoredLanguage();
if (stored && stored !== currentLanguage) {
  setLanguage(stored);
}
