import fs from "fs/promises";
import path from "path";
import sift from "sift";
import readYamlFile from "read-yaml-file/index";
import { slugify } from "@src/infra/slugify";
import { paginate } from "@src/infra/paginate";
import { Guide, GuideInput, GuidesInput, SiteLocale } from "@api/gql_types";
import { gqlInput } from "@api/infra/graphql/gqlInput";
import { storage } from "@api/infra/storage";

const ALLOW_LIST = [];

const pathToGuideByLocale = {
  [SiteLocale.PtBr]: path.resolve(".", "_data", "guides", "pt_BR"),
  [SiteLocale.EnUs]: path.resolve(".", "_data", "guides", "en_US"),
  [SiteLocale.Es]: path.resolve(".", "_data", "guides", "es"),
};

export function guidesRepository() {
  const repository = {
    async getAll({ input }: { input: GuidesInput }): Promise<Guide[]> {
      const { filter = {}, offset, limit, locale } = input;
      const pathToGuides = pathToGuideByLocale[locale || SiteLocale.PtBr];

      if (!pathToGuides) {
        throw new Error(`Locale ${locale} not found`);
      }

      const guideFileNames = (await fs.readdir(pathToGuides)).filter(
        (fileName) => !ALLOW_LIST.includes(fileName)
      );

      const guides = await Promise.all<Guide>(
        guideFileNames.map(async (fileName) => {
          const slug = slugify(fileName.replace(".yaml", ""));

          const guideCache = await storage.get(`guide-${locale}-${slug}`);
          if (guideCache) return guideCache;

          const fileContent = await readYamlFile<any>(
            path.resolve(pathToGuides, fileName)
          );

          return {
            ...fileContent,
            id: slug,
            slug: slug,
            tags: fileContent.tags || [],
            name: fileContent.name,
            expertises: fileContent.expertise.map((expertise) => {
              let cards = [];

              if (expertise.cards) {
                cards = expertise.cards.map((card) => {
                  const [slug] = Object.keys(card);
                  return {
                    item: {
                      ...card,
                      id: slug,
                      slug: slug,
                    },
                    priority: card.priority,
                    optional: Boolean(card.optional),
                  };
                });
              }

              return {
                ...expertise,
                cards,
              };
            }),
            collaborations: fileContent.collaboration.map((collaboration) => {
              let cards = [];

              if (collaboration.cards) {
                cards = collaboration.cards.map((card) => {
                  const [slug] = Object.keys(card);

                  return {
                    item: {
                      ...card,
                      id: slug,
                      slug: slug,
                    },
                    optional: Boolean(card.optional),
                    priority: card.priority,
                  };
                });
              }

              return {
                ...collaboration,
                cards,
              };
            }),
            video: fileContent.video || "",
            faq: fileContent.faq || [],
          };
        })
      );

      guides.forEach((guide) =>
        storage.set(`guide-${locale}-${guide.slug}`, guide)
      );

      const output = paginate<Guide>(
        guides.filter(sift(filter)),
        limit,
        offset
      );

      return output;
    },
    async getBySlug({ input }: { input: GuideInput }): Promise<Guide> {
      const guides = await repository.getAll({
        input: gqlInput<GuidesInput>({
          ...input,
          filter: {
            slug: {
              eq: input.slug,
            },
          },
        }),
      });

      return guides[0];
    },
  };

  return repository;
}
