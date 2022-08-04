import { initializeApollo } from "@api/apolloClient";
import { CreateSampleTextDocument } from "@src/gql_types";

export { default } from "@src/screens/HomeScreen";

export async function getStaticProps() {
  const apolloClient = initializeApollo();

  const { data } = await apolloClient.mutate({
    mutation: CreateSampleTextDocument,
    variables: {
      input: {
        text: "Sample test",
      },
    },
  });

  return {
    props: data,
  };
}
