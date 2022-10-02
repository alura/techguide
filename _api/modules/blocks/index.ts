import { gql } from "apollo-server-micro";
import { Resolvers, SiteLocale } from "@api/gql_types";
import { blocksRepository } from "@api/modules/blocks/repository";
import { gqlInput } from "@api/infra/graphql/gqlInput";
import { guidesRepository } from "../guides/repository";
import _ from "lodash";

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
    # COURSE
    PODCAST
    ARTICLE
    YOUTUBE
    CHALLENGE
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
    expertises: [GuideExpertise]
    collaborations: [GuideCollaboration]
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
    locale: SiteLocale
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
  Block: {
    async expertises(parent) {
      const guides = await guidesRepository().getAll({ input: {} });
      const expertises = guides
        .map((guide) => {
          return guide.expertises;
        })
        .flatMap((expertise) => expertise);

      return _.filter(expertises, (expertise) => {
        return _.some(expertise.blocks, { item: { slug: parent.slug } });
      });
    },
    async collaborations(parent) {
      const guides = await guidesRepository().getAll({ input: {} });
      const collaborations = guides
        .map((guide) => {
          return guide.collaborations;
        })
        .flatMap((collaboration) => collaboration);

      return _.filter(collaborations, (collaboration) => {
        return _.some(collaboration.blocks, { item: { slug: parent.slug } });
      });
    },
  },
  Query: {
    async blocks(_, { input, locale }) {
      const blocks = await blocksRepository().getAll({
        input: gqlInput({
          ...input,
          locale: locale || SiteLocale.PtBr,
        }),
      });
      return blocks;
    },
    async block(_, { input, locale }) {
      const block = await blocksRepository().getBySlug({
        input: gqlInput({
          ...input,
          locale: locale || SiteLocale.PtBr,
        }),
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
