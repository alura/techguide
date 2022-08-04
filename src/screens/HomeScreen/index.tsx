import React from "react";
import { Box } from "@src/components";
import { CreateSampleTextMutation, GuidesQuery } from "@src/gql_types";

type HomeScreenProps = {} & CreateSampleTextMutation & GuidesQuery;
export default function HomeScreen(props: HomeScreenProps) {
  return (
    <Box>
      {props?.guides?.map((guide) => (
        <Box key={guide.id}>{guide.name}</Box>
      ))}
      <pre>{JSON.stringify(props, null, 4)}</pre>
    </Box>
  );
}
