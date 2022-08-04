import fs from "fs/promises";
import path from "path";
import { gql } from "apollo-server-micro";
import { Resolvers } from "@api/gql_types";
import { uuid } from "@src/infra/uuid/uuid";
import readYamlFile from "read-yaml-file/index";
import { slugify } from "@src/infra/slugify/slugify";
import { capitalizeFirst } from "@src/infra/string/capitalizeFirst";

const typeDefs = gql`
  type Guide {
    id: UUID
    slug: String
    name: String
  }

  input GuideInput {
    limit: Int
    offset: Int
  }

  # Query
  extend type Query {
    guide(input: GuideInput): Guide
    guides(input: GuideInput): [Guide]!
  }
`;

const resolvers: Resolvers = {
  Query: {
    guides: async () => {
      const pathToGuides = path.resolve(".", "_data", "guides");
      const guideFileNames = await fs.readdir(
        path.resolve(".", "_data", "guides")
      );
      const guides = await Promise.all(
        guideFileNames.map(async (fileName) => {
          const fileContent = await readYamlFile<any>(
            path.resolve(pathToGuides, fileName)
          );
          return {
            id: uuid(),
            slug: slugify(fileName.replace(".yaml", "")),
            name: capitalizeFirst(fileName.replace(".yaml", "")),
            ...fileContent,
          };
        })
      );
      // eslint-disable-next-line no-console
      console.log(guides);

      return guides;
    },
    guide: async () => {
      return {
        id: uuid(),
        name: "Guide 1",
      };
    },
  },
  Mutation: {},
};

export default {
  typeDefs,
  resolvers,
};
