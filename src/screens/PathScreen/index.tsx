import React from "react";
import { Box } from "@src/components";
import { PathScreenGetGuideBySlugQuery } from "@src/gql_types";

type PathScreenProps = PathScreenGetGuideBySlugQuery;
export default function PathScreen({ guide }: PathScreenProps) {
  return (
    <Box>
      <h1>{guide.name}</h1>
      <h2>{guide.slug}</h2>

      <section>
        <h3>Esquerdo</h3>
        {guide.collaborations[0].name}
        {guide.collaborations[0].blocks.map((block) => (
          <div key={block.item?.slug}>
            {block.priority} - {block?.item?.name}
          </div>
        ))}
      </section>
      <section>
        <h3>Direita</h3>
        {guide.collaborations[1].name}
        {guide.collaborations[1].blocks.map((block) => (
          <div key={block.item?.slug}>
            {block.priority} - {block?.item?.name}
          </div>
        ))}
      </section>

      <div>
        <a href="/">Voltar para home</a>
      </div>

      <div>
        <hr />
      </div>

      <pre>{JSON.stringify(guide, null, 2)}</pre>
    </Box>
  );
}
