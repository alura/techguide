import React from "react";
import { Box, Link, Text } from "@src/components";
import { SiteLocale } from "@src/gql_types";
import { I18nProvider, useI18n } from "@src/infra/i18n";
import { CommonHead } from "@src/wrappers/pageHOC";
import ptBRLocale from "../_data/locale/pt-BR";
import enUsLocale from "../_data/locale/en-US";
import esLocale from "../_data/locale/es";
import Footer from "@src/patterns/Footer";
import Menu from "@src/patterns/Menu";

const copyByLocale = {
  [SiteLocale.PtBr]: {
    "HEAD.TITLE": ptBRLocale["HEAD.TITLE"],
    "HEAD.DESCRIPTION": ptBRLocale["HEAD.DESCRIPTION"],
    "FOOTER.DESCRIPTION": ptBRLocale["FOOTER.DESCRIPTION"],
    "FOOTER.OPEN_SOURCE_CTA": ptBRLocale["FOOTER.OPEN_SOURCE_CTA"],
    "404.TITLE": "Ops!",
    "404.DESCRIPTION":
      "Não conseguimos encontrar a página que você estava procurando.",
    "404.CTA": "Voltar para a página inicial",
  },
  [SiteLocale.EnUs]: {
    "HEAD.TITLE": enUsLocale["HEAD.TITLE"],
    "HEAD.DESCRIPTION": enUsLocale["HEAD.DESCRIPTION"],
    "FOOTER.DESCRIPTION": enUsLocale["FOOTER.DESCRIPTION"],
    "FOOTER.OPEN_SOURCE_CTA": enUsLocale["FOOTER.OPEN_SOURCE_CTA"],
    "404.TITLE": "Ops!",
    "404.DESCRIPTION": "We couldn't find the page you were looking for.",
    "404.CTA": "Back to home page",
  },
  [SiteLocale.Es]: {
    "HEAD.TITLE": esLocale["HEAD.TITLE"],
    "HEAD.DESCRIPTION": esLocale["HEAD.DESCRIPTION"],
    "FOOTER.DESCRIPTION": esLocale["FOOTER.DESCRIPTION"],
    "FOOTER.OPEN_SOURCE_CTA": esLocale["FOOTER.OPEN_SOURCE_CTA"],
    "404.TITLE": "Ops!",
    "404.DESCRIPTION": "No pudimos encontrar la página que buscabas.",
    "404.CTA": "Volver a la página de inicio",
  },
};

export default function NotFoundScreen() {
  const currentURL = globalThis?.location?.pathname || "/pt-BR";
  let locale = SiteLocale.PtBr;

  if (currentURL.includes("/en-US")) {
    locale = SiteLocale.EnUs;
  }
  if (currentURL.includes("/es")) {
    locale = SiteLocale.Es;
  }
  if (currentURL.includes("/pt-BR")) {
    locale = SiteLocale.PtBr;
  }

  return (
    <I18nProvider locale={locale} keys={copyByLocale[locale]}>
      <CommonHead noIndex />
      <Menu />
      <Screen locale={locale} />
      <Footer />
    </I18nProvider>
  );
}

function Screen({ locale }: { locale: SiteLocale }) {
  const i18n = useI18n();

  return (
    <Box
      tag="main"
      styleSheet={{
        flex: 1,
        justifyContent: "flex-start",
        background: "linear-gradient(180deg, #0f1825 0%, #010a11 62.08%)",
        overflow: "hidden",
        padding: "1rem 10%",
      }}
    >
      <Box
        styleSheet={{
          flex: 1,
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          styleSheet={{
            color: "#FFFFFF",
            marginTop: "0.4em",
            maxWidth: "800px",
            fontWeight: "600",
            textAlign: "center",
            letterSpacing: "-0.01em",
            fontSize: {
              xs: "4.063rem",
              md: "8rem",
            },
          }}
        >
          {i18n.content("404.TITLE")}
        </Text>
        <Text
          styleSheet={{
            color: "#FFFFFF",
          }}
        >
          {i18n.content("404.DESCRIPTION")}
        </Text>
        <Link
          href="/"
          locale={locale}
          styleSheet={{
            alignSelf: {
              xs: "center",
              md: "flex-start",
            },
            margin: "32px auto",
            textDecoration: "none",
            color: "#000000",
            backgroundColor: "#2cfdbe",
            border: "1px solid #2cfdbe",
            paddingVertical: "16px",
            paddingHorizontal: "32px",
            fontSize: "16px",
            transition: ".3s",
            borderRadius: "8px",
            hover: {
              color: "#2cfdbe",
              opacity: 1,
              backgroundColor: "transparent",
            },
            focus: {
              color: "#2cfdbe",
              opacity: 1,
              backgroundColor: "transparent",
            },
          }}
        >
          {i18n.content("404.CTA")}
        </Link>
      </Box>
    </Box>
  );
}
