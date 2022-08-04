import React from "react";
import { Box } from "@src/components";

export default function HomeScreen(props: any) {
  return (
    <Box>
      {props?.guides?.map((guide) => (
        <Box key={guide.id}>{guide.name}</Box>
      ))}
      <pre>{JSON.stringify(props, null, 4)}</pre>
    </Box>
  );
}
