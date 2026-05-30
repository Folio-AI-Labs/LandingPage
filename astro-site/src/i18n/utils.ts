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
  // Separate any #fragment so the trailing-slash logic only applies to the
  // pathname. Without this, '/#features' becomes '/#features/' and the in-page
  // anchor scroll breaks.
  const hashIndex = path.indexOf('#');
  const hash = hashIndex === -1 ? '' : path.slice(hashIndex);
  const pathname = hashIndex === -1 ? path : path.slice(0, hashIndex);

  const localized = lang === defaultLang ? pathname : `/${lang}${pathname}`;
  // GitHub Pages serves directory-style URLs and 301-redirects the slashless
  // form (/privacy -> /privacy/). Emit the trailing slash so internal links
  // match the canonical URL and Google does not flag "Page with redirect".
  const withSlash = localized.endsWith('/') ? localized : `${localized}/`;
  return `${withSlash}${hash}`;
}

export function getCurrentPath(url: URL): string {
  const lang = getLangFromUrl(url);
  if (lang === defaultLang) return url.pathname;
  return url.pathname.replace(`/${lang}`, '') || '/';
}
