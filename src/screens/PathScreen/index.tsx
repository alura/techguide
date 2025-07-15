import React from "react";
import ScreenHeroContainer from "@src/patterns/ScreenHeroContainer";
import { pageHOC } from "@src/wrappers/pageHOC";
import TShape from "./patterns/TShape";
import { PathScreenGetGuideBySlugQuery } from "@src/gql_types";
import { HubSpotForm } from "@src/components/HubSpotForm";

interface PathScreenProps {
  external?: string;
  guide: PathScreenGetGuideBySlugQuery["guide"];
}
function PathScreen({ external, guide }: PathScreenProps) {
  return (
    <ScreenHeroContainer guide={guide}>
      {guide.pdfFormId && <HubSpotForm formId={guide.pdfFormId} />}

      <TShape guide={guide} externalGuideCreator={external} />
    </ScreenHeroContainer>
  );
}

export default pageHOC(PathScreen);
