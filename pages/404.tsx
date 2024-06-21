import React from "react";
import { Box, Link, Text } from "@src/components";
import { SiteLocale } from "@src/gql_types";
import { I18nProvider, useI18n } from "@src/infra/i18n";

const copyByLocale = {
  [SiteLocale.PtBr]: {
    "404.TITLE": "404",
    "404.DESCRIPTION": "Página não encontrada",
  },
  [SiteLocale.EnUs]: {
    "404.TITLE": "404",
    "404.DESCRIPTION": "Page not found",
  },
  [SiteLocale.Es]: {
    "404.TITLE": "404",
    "404.DESCRIPTION": "Página no encontrada",
  },
};

export default function NotFoundScreen() {
  const currentURL = globalThis?.location?.pathname || "/pt-BR";
  let locale;

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
      <Screen locale={locale} />
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
        <Link
          href="/"
          locale={locale}
          styleSheet={{
            color: "#FFFFFF",
          }}
        >
          {i18n.content("404.DESCRIPTION")}
        </Link>
      </Box>
    </Box>
  );
}
