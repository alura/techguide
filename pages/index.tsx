import { initializeApollo } from "@src/infra/apolloClient";
import { HomeGetAllGuidesDocument, SiteLocale } from "@src/gql_types";
import { GetStaticProps } from "next";
import { withLocaleContent } from "@src/infra/i18n/withLocaleContent";

export { default } from "@src/screens/HomeScreen";

export const getStaticProps: GetStaticProps = async (ctx) => {
  const apolloClient = initializeApollo();
  const locale = (ctx.locale || SiteLocale.PtBr) as SiteLocale;

  const { data } = await apolloClient.query({
    query: HomeGetAllGuidesDocument,
    variables: {
      locale,
      input: {
        limit: 100,
      },
    },
  });

  return withLocaleContent(
    {
      props: {
        ...data,
        locale,
      },
    },
    locale
  );
};
