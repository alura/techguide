import fs from "fs/promises";
import path from "path";
import sift from "sift";
import readYamlFile from "read-yaml-file/index";
import { slugify } from "@src/infra/slugify";
import { paginate } from "@src/infra/paginate";
import { Block, BlockInput, BlocksInput, SiteLocale } from "@api/gql_types";
import { gqlInput } from "@api/infra/graphql/gqlInput";
import { storage } from "@api/infra/storage";

const ALLOW_LIST = [];

const pathToBlocksByLocale = {
  [SiteLocale.PtBr]: path.resolve(".", "_data", "blocks", "pt_BR"),
  [SiteLocale.EnUs]: path.resolve(".", "_data", "blocks", "en_US"),
};

export function blocksRepository() {
  const repository = {
    async getAll({ input }: { input: BlocksInput }): Promise<Block[]> {
      const { filter = {}, offset, limit, locale } = input;
      const pathToBlocks = pathToBlocksByLocale[locale];

      const blockFileNames = await (
        await Promise.all(await fs.readdir(pathToBlocks))
      ).filter((fileName) => !ALLOW_LIST.includes(fileName));

      const blocksPromise = blockFileNames.map(async (fileName) => {
        const slug = slugify(fileName.split(".")[0]);

        const blockCache = await storage.get(`block-${locale}-${slug}`);
        if (blockCache) return blockCache;

        const fileContent = await readYamlFile<any>(
          path.resolve(pathToBlocks, fileName)
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

      const blocksSettled = await Promise.allSettled<Block>(blocksPromise);
      const blocks = blocksSettled
        .filter((block) => block.status === "fulfilled")
        .map((block) => (block as any).value);

      blocks.forEach((block) =>
        storage.set(`block-${locale}-${block.slug}`, block)
      );

      const output = paginate<Block>(
        blocks.filter(sift(filter)),
        limit,
        offset
      );

      return output;
    },
    async getBySlug({ input }: { input: BlockInput }): Promise<Block> {
      const blocks = await repository.getAll({
        input: gqlInput<BlocksInput>({
          ...input,
          filter: {
            slug: {
              eq: input.slug,
            },
          },
        }),
      });

      return blocks[0];
    },
  };

  return repository;
}
