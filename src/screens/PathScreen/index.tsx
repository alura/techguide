import React from "react";
import ScreenHeroContainer from "@src/patterns/ScreenHeroContainer";
import { pageHOC } from "@src/wrappers/pageHOC";
import TShape from "./patterns/TShape";
import { PathScreenGetGuideBySlugQuery } from "@src/gql_types";
import { HubspotForm } from "@src/components/HubspotForm";

interface PathScreenProps {
  external?: string;
  guide: PathScreenGetGuideBySlugQuery["guide"];
}
function PathScreen({ external, guide }: PathScreenProps) {
  return (
    <ScreenHeroContainer guide={guide}>
      {guide.pdfFormId && (
        <HubspotForm
          formId={guide.pdfFormId}
          onFormSubmitted={() => {
            // eslint-disable-next-line no-console
            console.log("form submitted");
            const slug = guide.slug;
            const locale = "PT_BR";
            const pdfUrl = `https://raw.githubusercontent.com/alura/techguide/refs/heads/main/_data/downloadFiles/${locale}/${slug}.pdf`;
            window.open(pdfUrl, "_blank");
          }}
        />
      )}
      <TShape guide={guide} externalGuideCreator={external} />
    </ScreenHeroContainer>
  );
}

export default pageHOC(PathScreen);
