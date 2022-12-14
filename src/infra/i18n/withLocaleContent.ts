import path from "path";
import fs from "fs";
import { SiteLocale } from "@src/gql_types";

const fileNameByLocale = {
  [SiteLocale.EnUs]: "en-US.json",
  [SiteLocale.PtBr]: "pt-BR.json",
  [SiteLocale.Es]: "es.json",
};

export function withLocaleContent<NextContext>(
  ctx: NextContext,
  locale: SiteLocale
): NextContext {
  const props = (ctx as unknown as any).props;
  const localeFilePath = path.join(
    ".",
    "_data",
    "locale",
    fileNameByLocale[locale]
  );
  const i18nKeys = JSON.parse(
    fs.readFileSync(localeFilePath, "utf8")
  ) as Record<string, string>;
  return {
    ...ctx,
    props: {
      ...props,
      i18nKeys,
    },
  };
}
