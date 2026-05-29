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
  const localized = lang === defaultLang ? path : `/${lang}${path}`;
  // GitHub Pages serves directory-style URLs and 301-redirects the slashless
  // form (/privacy -> /privacy/). Emit the trailing slash so internal links
  // match the canonical URL and Google does not flag "Page with redirect".
  return localized.endsWith('/') ? localized : `${localized}/`;
}

export function getCurrentPath(url: URL): string {
  const lang = getLangFromUrl(url);
  if (lang === defaultLang) return url.pathname;
  return url.pathname.replace(`/${lang}`, '') || '/';
}
