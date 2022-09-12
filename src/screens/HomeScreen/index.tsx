import React from "react";
import { HomeGetAllGuidesQuery } from "@src/gql_types";
import { pageHOC } from "@src/wrappers/pageHOC";
import GuidesGrid from "../../patterns/ScreenHeroContainer/patterns/GuidesGrid";
import ScreenHeroContainer from "@src/patterns/ScreenHeroContainer";

interface HomeScreenProps {
  guides: HomeGetAllGuidesQuery["guides"];
}

function HomeScreen({ guides }: HomeScreenProps) {
  return (
    <ScreenHeroContainer>
      <GuidesGrid guides={guides} />
    </ScreenHeroContainer>
  );
}

export default pageHOC(HomeScreen);
