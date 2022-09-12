import { initializeApollo } from "@src/infra/apolloClient";
import { HomeGetAllGuidesDocument, SiteLocale } from "@src/gql_types";
import { GetStaticProps } from "next";
import { withLocaleContent } from "@src/infra/i18n/withLocaleContent";

export { default } from "@src/screens/HomeScreen";

export const getStaticProps: GetStaticProps = async () => {
  const apolloClient = initializeApollo();
  const locale = SiteLocale.PtBr;

  const { data } = await apolloClient.query({
    query: HomeGetAllGuidesDocument,
    variables: {
      locale,
    },
  });

  return withLocaleContent(
    {
      props: {
        ...data,
        locale: "pt-BR",
      },
    },
    locale
  );
};
