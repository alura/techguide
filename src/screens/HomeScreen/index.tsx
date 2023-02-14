import React from "react";
import { HomeGetAllGuidesQuery } from "@src/gql_types";
import { pageHOC } from "@src/wrappers/pageHOC";
import GuidesGrid from "./patterns/GuidesGrid";
import ScreenHeroContainer from "@src/patterns/ScreenHeroContainer";
import { GuidesFilter } from "./patterns/GuidesFilter/GuidesFilter";

interface HomeScreenProps {
  guides: HomeGetAllGuidesQuery["guides"];
}

function HomeScreen({ guides }: HomeScreenProps) {
  const [filter, setFilter] = React.useState("all");

  return (
    <ScreenHeroContainer>
      <GuidesFilter filter={filter} setFilter={setFilter} />
      <GuidesGrid tagToFilter={filter} guides={guides} />
    </ScreenHeroContainer>
  );
}

export default pageHOC(HomeScreen);
