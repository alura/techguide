import React from "react";
import { Box } from "@src/components";
import { PathScreenGetGuideBySlugQuery } from "@src/gql_types";

type PathScreenProps = PathScreenGetGuideBySlugQuery;
export default function PathScreen({ guide }: PathScreenProps) {
  return (
    <Box>
      <h1>{guide.name}</h1>
      <h2>{guide.slug}</h2>

      <div>
        <a href="/">Voltar para home</a>
      </div>

      <pre>{JSON.stringify(guide, null, 2)}</pre>
    </Box>
  );
}
