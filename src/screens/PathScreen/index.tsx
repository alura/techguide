/* eslint-disable no-console */
import React from "react";
import { Box } from "@src/components";
import { PathScreenGetGuideBySlugQuery } from "@src/gql_types";
import { useBlock } from "./logic/useBlock";

interface BlockData {
  name: string[] | string;
  parent: "Origin" | "" | string;
  value: string;
}

type PathScreenProps = PathScreenGetGuideBySlugQuery;
export default function PathScreen({ guide }: PathScreenProps) {
  const baseData: BlockData[] = [
    { name: "Origin", parent: "", value: "0" },
    ...guide.expertises[0].blocks.map((block) => {
      return {
        name: block.item.name.split(" "),
        parent: "Origin",
        value: String(block.priority),
      };
    }),
  ];

  // const leftBlockSVG = useBlock(baseData);
  // const rightBlockSVG = useBlock(baseData);
  const expertiseFirst = useBlock(baseData);

  return (
    <Box>
      <h1>{guide.name}</h1>
      <h2>{guide.slug}</h2>

      <Box
        styleSheet={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* <svg
          viewBox="0 0 445 445"
          ref={leftBlockSVG}
          style={{ width: "100%", height: "100%", aspectRatio: "1" }}
        /> */}
        <svg
          viewBox="0 0 445 445"
          ref={expertiseFirst}
          style={{ width: "50%", height: "100%", aspectRatio: "1" }}
        />
        {/* <svg
          viewBox="0 0 445 445"
          ref={rightBlockSVG}
          style={{ width: "100%", height: "100%", aspectRatio: "1" }}
        /> */}
      </Box>

      <div>
        <a href="/">Voltar para home</a>
      </div>

      <div>
        <hr />
      </div>

      {/* <pre>{JSON.stringify(guide, null, 2)}</pre> */}
    </Box>
  );
}
