import {
  GuideCard,
  GuideCollaboration,
  GuideExpertise,
  SiteLocale,
} from "@src/gql_types";
import localePT_BR from "_data/locale/pt-BR";
import localeEN_US from "_data/locale/en-US";
import localeES from "_data/locale/es";

const stringsByLocale: Record<SiteLocale, Record<string, any>> = {
  PT_BR: localePT_BR,
  EN_US: localeEN_US,
  ES: localeES,
};

interface MarkdownTemplate {
  name: string;
  level1: GuideExpertise;
  level2: GuideExpertise;
  level3: GuideExpertise;
  collaboration1: GuideCollaboration;
  collaboration2: GuideCollaboration;
}
export function templateMarkdown(
  {
    name,
    level1,
    level2,
    level3,
    collaboration1,
    collaboration2,
  }: MarkdownTemplate,
  locale: SiteLocale
) {
  const template = `
# ${name}
## ${stringsByLocale[locale]["SHAREABLE_GUIDE.LEVEL_1"]}
${level1.cards.map((card) => formatBlock(card, locale)).join("\n")}
## ${stringsByLocale[locale]["SHAREABLE_GUIDE.LEVEL_2"]}
${level2.cards.map((card) => formatBlock(card, locale)).join("\n")}
## ${stringsByLocale[locale]["SHAREABLE_GUIDE.LEVEL_3"]}
${level3.cards.map((card) => formatBlock(card, locale)).join("\n")}
## ${stringsByLocale[locale]["SHAREABLE_GUIDE.COLLABORATION_1"]}: ${
    collaboration1.name
  } 
${collaboration1.cards.map((card) => formatBlock(card, locale)).join("\n")}
## ${stringsByLocale[locale]["SHAREABLE_GUIDE.COLLABORATION_2"]}: ${
    collaboration2.name
  } 
${collaboration2.cards.map((card) => formatBlock(card, locale)).join("\n")}
`;
  return template.split("\n").slice(1).join("\n");
}

// Utils

function formatBlock(block: GuideCard, locale: SiteLocale) {
  const itemName = block.item?.name;
  const keyObjectives = block?.item?.keyObjectives;
  const contents = block?.item?.contents;
  const aluraContents = block?.item?.aluraContents;

  if (!keyObjectives) return "";

  let result = `
\n### ${itemName}:
${keyObjectives.map((ko) => `- ${ko.name}`).join("\n")}`;

  // Add contents if available
  if (contents && contents.length > 0) {
    result += `\n#### ${
      stringsByLocale[locale]["SHAREABLE_GUIDE.CONTENTS"]
    }\n${contents
      .map(
        (content) =>
          `- \`${labelByType(content.type, locale)}\` ${content.title}${
            content.link ? ` (${content.link})` : ""
          }`
      )
      .join("\n")}`;
  }

  // Add Alura contents if available
  if (aluraContents && aluraContents.length > 0) {
    result += `\n#### ${
      stringsByLocale[locale]["SHAREABLE_GUIDE.ALURA_CONTENTS"]
    }:\n${aluraContents
      .map(
        (content) =>
          `- \`${labelByType(content.type, locale)}\` ${content.title}${
            content.link ? ` (${content.link})` : ""
          }`
      )
      .join("\n")}`;
  }

  return result.split("\n").slice(1).join("\n");
}

const labelByType = (type: string, locale: SiteLocale) => {
  const defaultString =
    stringsByLocale[locale][`PATH.T_BLOCK_SUGGESTED_CONTENT.CONTENT.LABEL`];
  const string =
    stringsByLocale[locale][`PATH.T_BLOCK_SUGGESTED_CONTENT.${type}.LABEL`];
  if (string) {
    return string;
  }
  return defaultString;
};
