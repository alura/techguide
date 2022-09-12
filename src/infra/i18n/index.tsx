import React from "react";
import htmlReactParse, { domToReact, Element } from "html-react-parser";
import { Emoji, Icon, Link } from "@src/components";

export type I18nKey = string;
// eslint-disable-next-line no-unused-vars
export type I18nKeyReplace = { [key: string]: (props: any) => React.ReactNode };

const I18nContext = React.createContext<any>(null);

const intlKeyReplaceBase = {
  emoji: (props: any) => (
    <>
      <Emoji name={props.name} />
      {props.children}
    </>
  ),
  icon: (props: any) => (
    <>
      <Icon name={props.name} />
      {props.children}
    </>
  ),
  link: ({ children, ...props }: any) => (
    <>
      <Link {...props}>{children}</Link>
    </>
  ),
};

export function useI18n() {
  const i18nKeys = React.useContext(I18nContext);

  return {
    content<Output>(intlKey: string, intlKeyReplace?: I18nKeyReplace): Output {
      const isValidKey = i18nKeys && i18nKeys[intlKey];

      if (isValidKey) {
        return htmlReactParse(i18nKeys[intlKey], {
          replace: (replaceProps): any => {
            if (replaceProps instanceof Element && replaceProps.attribs) {
              const props = {
                ...replaceProps.attribs,
                children: domToReact(replaceProps.children),
              };

              const replace = {
                ...intlKeyReplaceBase,
                ...intlKeyReplace,
              };
              if (replace[replaceProps.name]) {
                return replace[replaceProps.name](props);
              }
            }
          },
        }) as unknown as Output;
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
