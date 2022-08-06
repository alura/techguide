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
  "javascript-fundamentals.pt_BR.yaml",
  "dom-fundamentals.pt_BR.yaml",
  "spa-concepts.pt_BR.yaml",
  "html-fundamentals.pt_BR.yaml",
  "css-fundamentals.pt_BR.yaml",
  "react-components.pt_BR.yaml",
  "react-props.pt_BR.yaml",
  "react-hooks-state.pt_BR.yaml",
  "create-react-app.pt_BR.yaml",
  "react-hooks-effect.pt_BR.yaml",
  "react-hooks-memo.pt_BR.yaml",
  "react-hooks-callback.pt_BR.yaml",
  "react-hooks-ref.pt_BR.yaml",
  "design-system-libraries.pt_BR.yaml",
  "react-dev-tools.pt_BR.yaml",
  "frontend-semantic-versioning.pt_BR.yaml",
  "css-in-js.pt_BR.yaml",
  "styled-components.pt_BR.yaml",
  "react-webrouting.pt_BR.yaml",
  "typescript-fundamentals.pt_BR.yaml",
  "yarn.pt_BR.yaml",
  "react-testing-library.pt_BR.yaml",
  "jest.pt_BR.yaml",
  "cypress.pt_BR.yaml",
  "javascript-callbacks-promises.pt_BR.yaml",
  "javascript-errorhandling.pt_BR.yaml",
  "babel-fundamentals.pt_BR.yaml",
  "lottie.pt_BR.yaml",
  "framer-motion.pt_BR.yaml",
  "service-workers.pt_BR.yaml",
  "react-hooks-form.pt_BR.yaml",
  "lodash.pt_BR.yaml",
  "graphql.pt_BR.yaml",
  "apollo-client.pt_BR.yaml",
  "redux-saga.pt_BR.yaml",
  "nextjs-fundamentals.pt_BR.yaml",
  "github-fundamentals.pt_BR.yaml",
  "http-fundamentals.pt_BR.yaml",
  "json.pt_BR.yaml",
  "command-line-fundamentals:.pt_BR.yaml",
  "babel.pt_BR.yaml",
  "design-systems.pt_BR.yaml",
  "figma-fundamentals.pt_BR.yaml",
  "design-components.pt_BR.yaml",
  "color-systems.pt_BR.yaml",
  "how-to-use-fonts.pt_BR.yaml",
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
