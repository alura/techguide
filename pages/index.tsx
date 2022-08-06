import { initializeApollo } from "@src/infra/apolloClient";
import { HomeGetAllGuidesDocument, SiteLocale } from "@src/gql_types";
import { GetStaticProps } from "next";

export { default } from "@src/screens/HomeScreen";

export const getStaticProps: GetStaticProps = async () => {
  const apolloClient = initializeApollo();

  const { data } = await apolloClient.query({
    query: HomeGetAllGuidesDocument,
    variables: {
      locale: SiteLocale.PtBr,
    },
  });

  return {
    props: data,
  };
};
