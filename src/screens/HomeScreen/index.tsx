import React from "react";
import { Box } from "@src/components";
import { HomeGetAllGuidesQuery } from "@src/gql_types";

type HomeScreenProps = HomeGetAllGuidesQuery;

export default function HomeScreen({ guides }: HomeScreenProps) {
  return (
    <Box>
      {guides?.map((guide) => (
        <Box key={guide.slug}>
          <a href={`/path/${guide.slug}`}>{guide.name}</a>
        </Box>
      ))}
    </Box>
  );
}
