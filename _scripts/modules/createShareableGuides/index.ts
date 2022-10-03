import path from "path";
import fs from "fs";
import {
  GuideExpertise,
  HomeGetAllGuidesDocument,
  PathScreenGetGuideBySlugDocument,
  SiteLocale,
} from "@src/gql_types";
import { initializeApollo } from "@src/infra/apolloClient";
import { log } from "../../infra/log";
import { GuideBlock, GuideCollaboration } from "@api/gql_types";

log("module/createShareableGuides");
main();

export async function main() {
  const apolloClient = initializeApollo();
  const locale = SiteLocale.PtBr;

  const { data } = await apolloClient.query({
    query: HomeGetAllGuidesDocument,
    variables: {
      locale,
    },
  });

  data.guides.forEach(async ({ slug, name }) => {
    const filePath = path.resolve(
      ".",
      "_data",
      "downloadFiles",
      locale,
      `${slug}`
    );

    const { data } = await apolloClient.query({
      query: PathScreenGetGuideBySlugDocument,
      variables: {
        input: {
          slug,
        },
        locale,
      },
    });

    log(`Creating shareable guide: ${filePath}`);
    // log(data);

    fs.writeFileSync(
      `${filePath}.md`,
      templateMarkdown({
        name,
        level1: data.guide.expertises[0],
        level2: data.guide.expertises[1],
        level3: data.guide.expertises[2],
        collaboration1: data.guide.collaborations[0],
        collaboration2: data.guide.collaborations[1],
      })
    );
  });
}

// ==============================
// ==============================

interface MarkdownTemplate {
  name: string;
  level1: GuideExpertise;
  level2: GuideExpertise;
  level3: GuideExpertise;
  collaboration1: GuideCollaboration;
  collaboration2: GuideCollaboration;
}
function templateMarkdown({
  name,
  level1,
  level2,
  level3,
  collaboration1,
  collaboration2,
}: MarkdownTemplate) {
  const template = `
# ${name}

## Nivel 1
${level1.blocks.map(formatBlock).join("\n")}

## Nivel 2
${level2.blocks.map(formatBlock).join("\n")}

## Nivel 3
${level3.blocks.map(formatBlock).join("\n")}

## Habilidade Auxiliar: ${collaboration1.name} 
${collaboration2.blocks.map(formatBlock).join("\n")}

## Habilidade Auxiliar: ${collaboration2.name} 
${collaboration2.blocks.map(formatBlock).join("\n")}
`;
  return template.split("\n").slice(1).join("\n");

  function formatBlock(block: GuideBlock) {
    return `
- [ ] **${block.item.name}**:
${block.item.keyObjectives.map((ko) => `   - ${ko.name}`).join("\n")}`
      .split("\n")
      .slice(1)
      .join("\n");
  }
}
