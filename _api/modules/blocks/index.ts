import { gql } from "apollo-server-micro";
import { Resolvers } from "@api/gql_types";
import { blocksRepository } from "@api/modules/blocks/repository";
import { gqlInput } from "@api/infra/graphql/gqlInput";

const typeDefs = gql`
  # Types
  type BlockKeyObjective {
    id: String
    slug: String
    name: String
  }
  type BlockAditionalObjective {
    id: String
    slug: String
    name: String
  }
  type BlockContent {
    id: String
    slug: String
    type: BlockContentType
    title: String
    link: String
  }
  enum BlockContentType {
    SITE
    COURSE
    ARTICLE
    YOUTUBE
  }
  type Block {
    id: String
    slug: String
    name: String
    logo: String
    shortDescription: String
    keyObjectives: [BlockKeyObjective]
    aditionalObjectives: [BlockAditionalObjective]
    contents: [BlockContent]
    aluraContents: [BlockContent]
  }

  # Filters
  input BlockFilters {
    id: FieldFilter
    slug: FieldFilter
    name: FieldFilter
  }

  # Query
  input BlocksInput {
    limit: Int
    offset: Int
    filter: BlockFilters
  }
  input BlockInput {
    slug: String!
  }
  extend type Query {
    block(input: BlockInput, locale: SiteLocale): Block
    blocks(input: BlocksInput, locale: SiteLocale): [Block]!
  }
`;

const resolvers: Resolvers = {
  Query: {
    async blocks(_, { input }) {
      const blocks = await blocksRepository().getAll({
        input: gqlInput(input),
      });

      return blocks;
    },
    async block(_, { input }) {
      const block = await blocksRepository().getBySlug({
        input: gqlInput(input),
      });
      return block;
    },
  },
  Mutation: {},
};

export default {
  typeDefs,
  resolvers,
};
