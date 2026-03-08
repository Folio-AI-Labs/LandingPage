import { defaultLang, type LanguageCode } from './languages';
import { translations, type TranslationKey } from './translations';

export function getLangFromUrl(url: URL): LanguageCode {
  const [, lang] = url.pathname.split('/');
  if (lang in translations) return lang as LanguageCode;
  return defaultLang;
}

export function useTranslations(lang: LanguageCode) {
  return function t(key: TranslationKey): string {
    return translations[lang][key] || translations[defaultLang][key];
  };
}

export function getLocalizedPath(path: string, lang: LanguageCode): string {
  if (lang === defaultLang) return path;
  return `/${lang}${path}`;
}

export function getCurrentPath(url: URL): string {
  const lang = getLangFromUrl(url);
  if (lang === defaultLang) return url.pathname;
  return url.pathname.replace(`/${lang}`, '') || '/';
}
