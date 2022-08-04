import fs from "fs/promises";
import path from "path";
import { gql } from "apollo-server-micro";
import readYamlFile from "read-yaml-file/index";
import { Resolvers } from "@api/gql_types";
import { uuid } from "@src/infra/uuid/uuid";
import { slugify } from "@src/infra/slugify/slugify";
import { capitalizeFirst } from "@src/infra/string/capitalizeFirst";
import { getLocale } from "@src/infra/locale/getLocale";

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
    guide(input: GuideInput, locale: SiteLocale): Guide
    guides(input: GuideInput, locale: SiteLocale): [Guide]!
  }
`;

const resolvers: Resolvers = {
  Query: {
    guides: async (_, { locale }) => {
      const currentLocale = getLocale(locale);
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
            id: uuid() + currentLocale,
            slug: slugify(fileName.replace(".yaml", "")),
            name: capitalizeFirst(fileName.replace(".yaml", "")),
            ...fileContent,
          };
        })
      );

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
