import React from "react";
import htmlReactParse, { domToReact, Element } from "html-react-parser";
import { Emoji, Icon, Link } from "@src/components";

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
  a: ({ children, ...props }: any) => (
    <>
      <Link {...props}>{children}</Link>
    </>
  ),
};

export function parseContent(content, intlKeyReplace?: any) {
  return htmlReactParse(content, {
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
  }) as any;
}
