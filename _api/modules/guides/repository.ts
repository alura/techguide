import fs from "fs/promises";
import path from "path";
import sift from "sift";
import readYamlFile from "read-yaml-file/index";
import { slugify } from "@src/infra/slugify";
import { paginate } from "@src/infra/paginate";
import { Guide, GuideInput, GuidesInput } from "@api/gql_types";
import { gqlInput } from "@api/infra/graphql/gqlInput";

const ALLOW_LIST = ["react.yaml"];

export function guidesRepository() {
  const pathToGuides = path.resolve(".", "_data", "guides");
  const repository = {
    async getAll({ input }: { input: GuidesInput }): Promise<Guide[]> {
      const { filter = {}, offset, limit } = input;

      const guideFileNames = (await fs.readdir(pathToGuides)).filter(
        (fileName) => ALLOW_LIST.includes(fileName)
      );

      const guides = await Promise.all<Guide>(
        guideFileNames.map(async (fileName) => {
          const fileContent = await readYamlFile<any>(
            path.resolve(pathToGuides, fileName)
          );
          const slug = slugify(fileName.replace(".yaml", ""));

          return {
            ...fileContent,
            id: slug,
            slug: slug,
            name: fileContent.name,
            expertises: fileContent.expertise.map((expertise) => {
              let blocks = [];

              if (expertise.blocks) {
                blocks = expertise.blocks.map((block) => {
                  const [slug] = Object.keys(block);

                  // eslint-disable-next-line no-console
                  // console.log(slug);

                  return {
                    id: slug,
                    slug: slug,
                    priority: block.priority,
                  };
                });
              }

              return {
                ...expertise,
                blocks,
              };
            }),
          };
        })
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
