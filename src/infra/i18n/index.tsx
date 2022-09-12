import React from "react";
import { parseContent } from "./parseContent";

export type I18nKey = string;
// eslint-disable-next-line no-unused-vars
export type I18nKeyReplace = { [key: string]: (props: any) => React.ReactNode };

const I18nContext = React.createContext<any>(null);

export function useI18n() {
  const i18nKeys = React.useContext(I18nContext);

  return {
    content<Output>(intlKey: string, intlKeyReplace?: I18nKeyReplace): Output {
      const isValidKey = i18nKeys && i18nKeys[intlKey];

      if (isValidKey) {
        return parseContent(i18nKeys[intlKey], intlKeyReplace) as Output;
      }
      return intlKey as unknown as Output;
    },
  };
}

interface I18nProviderProps {
  keys: Record<string, string>;
  children: React.ReactNode;
}
export function I18nProvider({ keys, children }: I18nProviderProps) {
  return <I18nContext.Provider value={keys}>{children}</I18nContext.Provider>;
}
