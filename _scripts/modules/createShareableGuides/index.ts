import path from "path";
import fs from "fs";
import { HomeGetAllGuidesDocument, SiteLocale } from "@src/gql_types";
import { initializeApollo } from "@src/infra/apolloClient";
import { log } from "../../infra/log";

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

  data.guides.forEach(({ slug, name }) => {
    const filePath = path.resolve(
      ".",
      "_data",
      "downloadFiles",
      locale,
      `${slug}`
    );

    log(`Creating shareable guide: ${filePath}`);

    fs.writeFileSync(
      `${filePath}.md`,
      templateMarkdown({
        name,
      })
    );
  });
}

// ==============================
// ==============================

interface MarkdownTemplate {
  name: string;
}
function templateMarkdown({ name }: MarkdownTemplate) {
  const template = `
# ${name}
`;
  return template.split("\n").slice(1).join("\n");
}
