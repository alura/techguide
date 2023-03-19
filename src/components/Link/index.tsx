/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import NextLink from "next/link";
import Text from "../Text";
import { StyleSheet } from "@skynexui/responsive_stylesheet";
import { useI18nLocale } from "@src/infra/i18n";
import { SiteLocale } from "@src/gql_types";

const urlLocaleBySiteLocale = {
  [SiteLocale.PtBr]: "pt-BR",
  [SiteLocale.EnUs]: "en-US",
  [SiteLocale.Es]: "es",
};

function withLocalePrefix(
  href: string,
  locale: string,
  isExternalURL: boolean
) {
  if (isExternalURL) return href;

  const urlLocale = urlLocaleBySiteLocale[locale];
  const baseHref = `/${urlLocale}/${href}`.replace("//", "/");

  // TODO: Fix this in future
  if (baseHref === "/pt-BR/") return "/";

  return baseHref;
}

interface LinkProps {
  href: string;
  target?: string;
  children: React.ReactNode;
  styleSheet?: StyleSheet;
}
function Link({ href, children, styleSheet, ...props }: LinkProps) {
  const locale = useI18nLocale();
  const isExternalURL = href?.startsWith("http");
  const hrefNormalized = withLocalePrefix(href, locale, isExternalURL);

  return (
    <NextLink href={hrefNormalized} passHref>
      <Text
        tag="a"
        styleSheet={{
          ...styleSheet,
          transition: ".2s ease-in-out",
          hover: {
            opacity: ".5",
            ...styleSheet?.hover,
          },
          focus: {
            opacity: ".5",
            ...styleSheet?.focus,
          },
        }}
        {...(isExternalURL && {
          target: "_blank",
        })}
        {...props}
      >
        {children}
      </Text>
    </NextLink>
  );
}

export default Link;
