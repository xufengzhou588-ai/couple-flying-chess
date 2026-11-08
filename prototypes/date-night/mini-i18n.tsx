import { createContext, useContext, type ReactNode } from 'react';
import { miniTranslations } from './mini-translations';

export type MiniLocale = 'en' | 'zh' | 'es';

type Pair = readonly [zh: string, es: string];

// English keys are the editorial source. The two translations preserve the same
// playable choice and boundary; test scripts check every visible mini-game key.
export const lines: Record<string, Pair> = miniTranslations;

export function miniText(locale: MiniLocale, english: string): string {
  if (locale === 'en') return english;
  const pair = lines[english];
  if (!pair) {
    const pieces = english.split(' · ');
    if (pieces.length > 1 && pieces.every(piece => lines[piece])) {
      return pieces.map(piece => miniText(locale, piece)).join(' · ');
    }
    if (import.meta.env.DEV) console.warn(`Missing ${locale} mini-game translation: ${english}`);
    return english;
  }
  return locale === 'zh' ? pair[0] : pair[1];
}

export function miniFormat(locale: MiniLocale, english: string, values: Record<string, string | number>) {
  return miniText(locale, english).replace(/\{([\w]+)\}/g, (_, key: string) => String(values[key] ?? `{${key}}`));
}

const MiniLocaleContext = createContext<MiniLocale>('en');

export function MiniLocaleProvider({ locale, children }: { locale: MiniLocale; children: ReactNode }) {
  return <MiniLocaleContext.Provider value={locale}>{children}</MiniLocaleContext.Provider>;
}

export function useMiniI18n() {
  const locale = useContext(MiniLocaleContext);
  return {
    locale,
    tr: (english: string) => miniText(locale, english),
    fmt: (english: string, values: Record<string, string | number>) => miniFormat(locale, english, values),
    displayName: (name: string) => name === 'Player 1' || name === 'Player 2' ? miniText(locale, name) : name
  };
}
