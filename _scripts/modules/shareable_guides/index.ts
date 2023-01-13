import path from "path";
import fs from "fs";
import { initializeApollo } from "@src/infra/apolloClient";
import { log } from "@scripts/modules/infra/log";
import {
  HomeGetAllGuidesDocument,
  PathScreenGetGuideBySlugDocument,
  SiteLocale,
} from "@src/gql_types";
import { templateMarkdown } from "./template";

export async function main() {
  const apolloClient = initializeApollo();
  const locales = Object.values(SiteLocale);

  for await (const locale of locales) {
    const { data } = await apolloClient.query({
      query: HomeGetAllGuidesDocument,
      variables: {
        locale: locale as SiteLocale,
        input: {
          limit: 100,
        },
      },
    });

    for await (const guide of data.guides) {
      const { slug, name } = guide;

      const filePath = path.resolve(
        __dirname,
        "..",
        "..",
        "..",
        "_data",
        "downloadFiles",
        locale,
        `${slug}`
      );
      log(filePath);

      const { data } = await apolloClient.query({
        query: PathScreenGetGuideBySlugDocument,
        variables: {
          input: {
            slug,
          },
          locale: locale as SiteLocale,
        },
      });

      log(`Creating shareable guide: ${filePath}`);

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
    }
  }
}

main();
