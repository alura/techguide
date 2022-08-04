import React from "react";
import { apolloServer, gql } from "_api/api";
import { Box } from "@src/components";

export default function HomeScreen({ guides }: any) {
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
