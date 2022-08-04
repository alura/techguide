/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Box } from "@src/components";
import { CreateSampleTextMutation, GuidesQuery } from "@src/gql_types";
import Link from "next/link";

type HomeScreenProps = {} & CreateSampleTextMutation & GuidesQuery;
export default function HomeScreen(props: HomeScreenProps) {
  return (
    <Box>
      Sample Screen
      <Box>
        <Link href="/">
          <a>Home</a>
        </Link>
        <Link href="/about">
          <a>Sobre</a>
        </Link>
      </Box>
      {props?.guides?.map((guide) => (
        <Box key={guide.id}>{guide.name}</Box>
      ))}
      <pre>{JSON.stringify(props, null, 4)}</pre>
    </Box>
  );
}
