import fs from "fs/promises";
import path from "path";
import sift from "sift";
import readYamlFile from "read-yaml-file/index";
import { slugify } from "@src/infra/slugify";
import { paginate } from "@src/infra/paginate";
import { Block, BlockInput, BlocksInput } from "@api/gql_types";
import { gqlInput } from "@api/infra/graphql/gqlInput";

const ALLOW_LIST = [
  "java-persistence.pt_BR.yaml",
  "ado.net.pt_BR.yaml",
  "javascript-errorhandling.pt_BR.yaml",
  "javascript-fundamentals.pt_BR.yaml",
  "design-systems.pt_BR.yaml",
];

export function blocksRepository() {
  const pathToBlocks = path.resolve(".", "_data", "blocks");
  const repository = {
    async getAll({ input }: { input: BlocksInput }): Promise<Block[]> {
      const { filter = {}, offset, limit } = input;

      const blockFileNames = await (
        await Promise.all(await fs.readdir(pathToBlocks))
      ).filter((fileName) => ALLOW_LIST.includes(fileName));

      const blocks = await Promise.all<Block>(
        blockFileNames.map(async (fileName) => {
          const fileContent = await readYamlFile<any>(
            path.resolve(pathToBlocks, fileName)
          );
          const slug = slugify(fileName.replace(".pt_BR.yaml", ""));

          return {
            ...fileContent,
            id: fileContent?.id || slug,
            slug: slug,
            name: fileContent.name,
            logo: fileContent.logo,
            shortDescription: fileContent["short-description"],
            keyObjectives: fileContent["key-objectives"]?.map(
              (keyObjective) => {
                const slug = slugify(keyObjective);
                return {
                  id: slug,
                  slug: slug,
                  name: keyObjective,
                };
              }
            ),
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
        })
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
