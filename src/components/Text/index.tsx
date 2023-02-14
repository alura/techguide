import React from "react";
import BaseComponent from "@src/theme/BaseComponent";
import { StyleSheet } from "@skynexui/responsive_stylesheet";
import { I18nKey, I18nKeyReplace, useI18n } from "@src/infra/i18n";

interface TextProps {
  tag?: "main" | "div" | "article" | "section" | "ul" | string;
  children?: React.ReactNode;
  i18nKey?: I18nKey;
  // eslint-disable-next-line no-unused-vars
  i18nKeyReplace?: I18nKeyReplace;
  styleSheet?: StyleSheet;
  name?: string;
  tabIndex?: number;
  htmlFor?: string;
  // eslint-disable-next-line no-unused-vars
  onKeyPress?: (event: any) => void;
}
const Text = React.forwardRef(
  (
    {
      styleSheet,
      children,
      tag,
      i18nKey,
      i18nKeyReplace,
      name,
      ...props
    }: TextProps,
    ref
  ) => {
    const i18n = useI18n();
    const Tag = tag || "p";
    const i18nChildren = i18n.content(i18nKey, i18nKeyReplace);
    return (
      <BaseComponent
        ref={ref}
        as={Tag}
        styleSheet={{
          display: "inline-block",
          ...styleSheet,
        }}
        name={name}
        {...props}
      >
        {children || i18nChildren}
      </BaseComponent>
    );
  }
);

Text.displayName = "Text";

export default Text;
