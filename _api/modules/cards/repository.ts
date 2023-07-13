import fs from "fs/promises";
import path from "path";
import sift from "sift";
import readYamlFile from "read-yaml-file/index";
import { slugify } from "@src/infra/slugify";
import { paginate } from "@src/infra/paginate";
import { Card, CardInput, CardsInput, SiteLocale } from "@api/gql_types";
import { gqlInput } from "@api/infra/graphql/gqlInput";
import { storage } from "@api/infra/storage";

const ALLOW_LIST = [];

const pathToCardsByLocale = {
  [SiteLocale.PtBr]: path.resolve(".", "_data", "cards", "pt_BR"),
  [SiteLocale.EnUs]: path.resolve(".", "_data", "cards", "en_US"),
  [SiteLocale.Es]: path.resolve(".", "_data", "cards", "es"),
};

export function cardsRepository() {
  const repository = {
    async getAll({ input }: { input: CardsInput }): Promise<Card[]> {
      const { filter = {}, offset, limit, locale } = input;
      const pathToCards = pathToCardsByLocale[locale || SiteLocale.PtBr];

      const cardFileNames = await (
        await Promise.all(await fs.readdir(pathToCards))
      ).filter((fileName) => !ALLOW_LIST.includes(fileName));

      const cardsPromise = cardFileNames.map(async (fileName) => {
        const slug = slugify(fileName.split(".")[0]);

        const cardCache = await storage.get(`card-${locale}-${slug}`);
        if (cardCache) return cardCache;

        const fileContent = await readYamlFile<any>(
          path.resolve(pathToCards, fileName)
        );

        return {
          ...fileContent,
          id: fileContent?.id || slug,
          slug: slug,
          name: fileContent.name,
          logo: fileContent.logo,
          shortDescription: fileContent["short-description"],
          keyObjectives: fileContent["key-objectives"]?.map((keyObjective) => {
            const slug = slugify(keyObjective);
            return {
              id: slug,
              slug: slug,
              name: keyObjective,
            };
          }),
          aditionalObjectives: fileContent["aditional-objectives"]?.map(
            (aditionalObjective) => {
              const slug = slugify(aditionalObjective);
              return {
                id: slug,
                slug: slug,
                name: aditionalObjective,
              };
            }
          ),
          contents: fileContent.contents?.map((content) => {
            const slug = slugify(content.title);
            return {
              ...content,
              type: content.type.toUpperCase(),
              id: slug,
              slug: slug,
              title: content.title,
            };
          }),
          aluraContents: fileContent["alura-contents"]?.map((content) => {
            const slug = slugify(content.title);
            return {
              ...content,
              type: content.type.toUpperCase(),
              id: slug,
              slug: slug,
              title: content.title,
            };
          }),
        };
      });

      const cardsSettled = await Promise.allSettled<Card>(cardsPromise);
      const cards = cardsSettled
        .filter((card) => card.status === "fulfilled")
        .map((card) => (card as any).value);

      cards.forEach((card) => storage.set(`card-${locale}-${card.slug}`, card));

      const output = paginate<Card>(cards.filter(sift(filter)), limit, offset);

      return output;
    },
    async getBySlug({ input }: { input: CardInput }): Promise<Card> {
      const cards = await repository.getAll({
        input: gqlInput<CardsInput>({
          ...input,
          filter: {
            slug: {
              eq: input.slug,
            },
          },
        }),
      });

      return cards[0];
    },
  };

  return repository;
}
