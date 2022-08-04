import React from "react";
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
