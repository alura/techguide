import { SiteLocale } from "@src/gql_types";
import React from "react";
import { parseContent } from "./parseContent";

export type I18nKey = string;
// eslint-disable-next-line no-unused-vars
export type I18nKeyReplace = { [key: string]: (props: any) => React.ReactNode };

const I18nContext = React.createContext<any>(null);
const I18nLocaleContext = React.createContext(null);

export function useI18n() {
  const i18nKeys = React.useContext(I18nContext);

  return {
    contentRaw(intlKey: string) {
      return i18nKeys[intlKey];
    },
    content<Output>(intlKey: string, intlKeyReplace?: I18nKeyReplace): Output {
      const isValidKey = i18nKeys && i18nKeys[intlKey];

      if (isValidKey) {
        return parseContent(i18nKeys[intlKey], intlKeyReplace) as Output;
      }
      return intlKey as unknown as Output;
    },
  };
}

export function useI18nLocale() {
  const i18nLocale = React.useContext(I18nLocaleContext);
  return i18nLocale;
}

interface I18nProviderProps {
  keys: Record<string, string>;
  locale: SiteLocale;
  children: React.ReactNode;
}
export function I18nProvider({ keys, children, locale }: I18nProviderProps) {
  return (
    <I18nLocaleContext.Provider value={locale}>
      <I18nContext.Provider value={keys}>{children}</I18nContext.Provider>
    </I18nLocaleContext.Provider>
  );
}
