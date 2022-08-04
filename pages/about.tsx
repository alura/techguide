import { initializeApollo } from "@api/apolloClient";
import { GuidesDocument } from "@src/gql_types";

export { default } from "@src/screens/HomeScreen";

export async function getStaticProps() {
  const apolloClient = initializeApollo();

  const { data } = await apolloClient.query({
    query: GuidesDocument,
  });

  return {
    props: data,
  };
}
