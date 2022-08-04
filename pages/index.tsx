import { apolloServer, gql } from "_api/api";

export { default } from "@src/screens/HomeScreen";

export async function getStaticProps() {
  const { data } = await apolloServer.executeOperation({
    query: gql`
      query Guides {
        guides {
          id
          name
        }
      }
    `,
  });

  return {
    props: data,
  };
}
