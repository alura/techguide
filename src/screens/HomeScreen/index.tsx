import { apolloServer, gql } from "@api/api";
import { Box } from "@src/components";

export default function HomeScreen({ guides }) {
  return (
    <Box>
      {guides.map((guide) => (
        <Box key={guide.id}>{guide.name}</Box>
      ))}
    </Box>
  );
}

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
