import React from "react";
import ScreenHeroContainer from "@src/patterns/ScreenHeroContainer";
import { pageHOC } from "@src/wrappers/pageHOC";

function CompaniesScreen() {
  return (
    <ScreenHeroContainer>
      <h1>Page</h1>
    </ScreenHeroContainer>
  );
}

export default pageHOC(CompaniesScreen);
