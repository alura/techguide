import React from "react";
import { Box } from "@src/components";
import { PathScreenGetGuideBySlugQuery } from "@src/gql_types";
import { useBlock } from "./logic/useBlock";
import TShape from "./components/TShape";

interface BlockData {
  name: string[] | string;
  parent: "Origin" | "" | string;
  value: string;
}

type PathScreenProps = PathScreenGetGuideBySlugQuery;
export default function PathScreen({ guide }: PathScreenProps) {
  const expertiseLevel01: BlockData[] = [
    { name: "Origin", parent: "", value: "0" },
    ...guide.expertises[0].blocks.map((block) => {
      return {
        name: block?.item?.name.split(" "),
        parent: "Origin",
        value: String(block.priority),
      };
    }),
  ];
  const expertiseLevel02: BlockData[] = [
    { name: "Origin", parent: "", value: "0" },
    ...guide.expertises[1].blocks.map((block) => {
      return {
        name: block?.item?.name.split(" "),
        parent: "Origin",
        value: String(block.priority),
      };
    }),
  ];
  const expertiseLevel03: BlockData[] = [
    { name: "Origin", parent: "", value: "0" },
    ...guide.expertises[2].blocks.map((block) => {
      return {
        name: block?.item?.name.split(" "),
        parent: "Origin",
        value: String(block.priority),
      };
    }),
  ];
  const collaborationsLeft: BlockData[] = [
    { name: "Origin", parent: "", value: "0" },
    ...guide.collaborations[0].blocks.map((block) => {
      return {
        name: block?.item?.name.split(" "),
        parent: "Origin",
        value: String(block.priority),
      };
    }),
  ];
  const collaborationsRight: BlockData[] = [
    { name: "Origin", parent: "", value: "0" },
    ...guide.collaborations[1].blocks.map((block) => {
      return {
        name: block?.item?.name.split(" "),
        parent: "Origin",
        value: String(block.priority),
      };
    }),
  ];

  const leftBlockSVG = useBlock(collaborationsLeft);
  const rightBlockSVG = useBlock(collaborationsRight);
  const expertiseFirst = useBlock(expertiseLevel01);
  const expertiseSecond = useBlock(expertiseLevel02);
  const expertiseThird = useBlock(expertiseLevel03);

  return (
    <Box>
      <h1>{guide.name}</h1>
      <h2>{guide.slug}</h2>

      <TShape
        leftBlock={{
          name: guide.collaborations[0].name,
          svg: leftBlockSVG,
        }}
        expertiseFirst={{
          name: guide.expertises[0].name,
          svg: expertiseFirst,
        }}
        expertiseSecond={{
          name: guide.expertises[1].name,
          svg: expertiseSecond,
        }}
        expertiseThird={{
          name: guide.expertises[2].name,
          svg: expertiseThird,
        }}
        rightBlock={{
          name: guide.collaborations[1].name,
          svg: rightBlockSVG,
        }}
      />

      <div>
        <a href="/">Voltar para home</a>
      </div>

      <div>
        <hr />
      </div>

      <pre style={{ width: "100%", overflow: "scroll" }}>
        {JSON.stringify(guide, null, 2)}
      </pre>
    </Box>
  );
}
