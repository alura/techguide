import { GuideCard, GuideCollaboration, GuideExpertise } from "@src/gql_types";

interface MarkdownTemplate {
  name: string;
  level1: GuideExpertise;
  level2: GuideExpertise;
  level3: GuideExpertise;
  collaboration1: GuideCollaboration;
  collaboration2: GuideCollaboration;
}
export function templateMarkdown({
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
${level1.cards.map(formatBlock).join("\n")}
## Nivel 2
${level2.cards.map(formatBlock).join("\n")}
## Nivel 3
${level3.cards.map(formatBlock).join("\n")}
## Habilidade Auxiliar: ${collaboration1.name} 
${collaboration1.cards.map(formatBlock).join("\n")}
## Habilidade Auxiliar: ${collaboration2.name} 
${collaboration2.cards.map(formatBlock).join("\n")}
`;
  return template.split("\n").slice(1).join("\n");
}

// Utils

function formatBlock(block: GuideCard) {
  const itemName = block.item?.name;
  const keyObjectives = block?.item?.keyObjectives;

  if (!keyObjectives) return "";

  return `
- [ ] **${itemName}**:
${keyObjectives.map((ko) => `   - ${ko.name}`).join("\n")}`
    .split("\n")
    .slice(1)
    .join("\n");
}
