import { SiteLocale } from "@src/gql_types";
import { withLocaleContent } from "@src/infra/i18n/withLocaleContent";

export const getStaticProps = async (ctx) => {
  const locale = (ctx.locale || SiteLocale.PtBr) as SiteLocale;

  return withLocaleContent(
    {
      props: {
        locale,
      },
    },
    locale
  );
};

export { default } from "@src/screens/CompaniesScreen";
