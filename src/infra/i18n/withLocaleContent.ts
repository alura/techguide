import { SiteLocale } from "@src/gql_types";

const fileNameByLocale = {
  [SiteLocale.EnUs]: "en-US.ts",
  [SiteLocale.PtBr]: "pt-BR.ts",
  [SiteLocale.Es]: "es.ts",
};

export async function withLocaleContent<NextContext>(
  ctx: NextContext,
  locale: SiteLocale
): Promise<NextContext> {
  const props = (ctx as unknown as any).props;
  const localeFile = await import(
    `../../../_data/locale/${fileNameByLocale[locale]}`
  );

  const i18nKeys = {
    questions: [],
    ...localeFile.default,
  };
  return {
    ...ctx,
    props: {
      ...props,
      i18nKeys,
    },
  };
}
