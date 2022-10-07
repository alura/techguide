import { PathScreenGetGuideBySlugQuery } from "@src/gql_types";

const handleContents = function (contents) {
  var output = "";
  if (contents === undefined) return output;
  contents.forEach((content) => {
    output += `    - [${content.title}](${content.link}) \n`;
  });
  output += `\n`;
  return output;
};

const handleBlock = function (blocks) {
  var output = "";
  blocks.forEach((block) => {
    output += `  - ${block.item.name} \n`;
    output += handleContents(block.item.contents);
  });
  output += `\n`;
  return output;
};

const handleExpertise = function (guide) {
  var output = "";
  guide.expertises.forEach((guide) => {
    output += `- [ ] **${guide.name}**:\n`;
    output += handleBlock(guide["blocks"]);
  });
  output += `\n`;
  return output;
};

const handleCollaboration = function (doc) {
  var output = "";
  doc.collaborations.forEach((guide) => {
    output += `- [ ] **${guide.name}**:\n`;
    output += handleBlock(guide["blocks"]);
  });
  output += `\n`;
  return output;
};

export function exportGuide(guide: PathScreenGetGuideBySlugQuery["guide"]) {
  var output = handleExpertise(guide);
  output += handleCollaboration(guide);
  console.log(output);
}
