/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import NextLink from "next/link";
import Text from "../Text";
import { StyleSheet } from "@skynexui/responsive_stylesheet";

function withLocalePrefix(
  href: string,
  locale: string,
  isExternalURL: boolean
) {
  if (isExternalURL) return href;

  if (locale !== "en-US") {
    // TODO: Remove this when enable en-US version
    if (href === "/") return href;

    return `${locale}${href}`;
  }
  return href;
}

interface LinkProps {
  href: string;
  target?: string;
  children: React.ReactNode;
  styleSheet?: StyleSheet;
}
function Link({ href, children, styleSheet, ...props }: LinkProps) {
  const locale = "pt-BR";
  const isExternalURL = href.startsWith("http");
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
