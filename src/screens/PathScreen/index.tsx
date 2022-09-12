import React from "react";
import ScreenHeroContainer from "@src/patterns/ScreenHeroContainer";
import { pageHOC } from "@src/wrappers/pageHOC";
import TShape from "./patterns/TShape";
import { PathScreenGetGuideBySlugQuery } from "@src/gql_types";

interface PathScreenProps {
  guide: PathScreenGetGuideBySlugQuery["guide"];
}
function PathScreen({ guide }: PathScreenProps) {
  return (
    <ScreenHeroContainer>
      <TShape guide={guide} />
    </ScreenHeroContainer>
  );
}

export default pageHOC(PathScreen);
