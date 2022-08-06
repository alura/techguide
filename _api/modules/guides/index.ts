import { gql } from "apollo-server-micro";
import { Resolvers } from "@api/gql_types";
import { guidesRepository } from "@api/modules/guides/repository";
import { gqlInput } from "@api/infra/graphql/gqlInput";
import { blocksRepository } from "../blocks/repository";
import _ from "lodash";

const typeDefs = gql`
  # Types
  extend type Block {
    priority: Int
  }

  type GuideExpertise {
    name: String
    blocks: [Block]
    guide: Guide
  }

  type Guide {
    id: String
    slug: String
    name: String
    expertises: [GuideExpertise]
  }
  input GuideFilters {
    id: FieldFilter
    slug: FieldFilter
    name: FieldFilter
  }

  # Query
  input GuidesInput {
    limit: Int
    offset: Int
    filter: GuideFilters
  }
  input GuideInput {
    slug: String!
  }
  extend type Query {
    guide(input: GuideInput, locale: SiteLocale): Guide
    guides(input: GuidesInput, locale: SiteLocale): [Guide]!
  }
`;

const resolvers: Resolvers = {
  Query: {
    async guides(_, { input }) {
      const guides = await guidesRepository().getAll({
        input: gqlInput(input),
      });

      return guides;
    },
    async guide(_, { input }) {
      const guide = await guidesRepository().getBySlug({
        input: gqlInput(input),
      });
      return guide;
    },
  },
  GuideExpertise: {
    async guide(parent) {
      const guides = await guidesRepository().getAll({ input: {} });
      return _.find(guides, (guide) => {
        return _.some(guide.expertises, { name: parent.name });
      });
    },
    async blocks(parent) {
      const blocks = await Promise.all(
        parent.blocks.map((block) => {
          return blocksRepository().getBySlug({
            input: gqlInput({
              slug: block.slug,
            }),
          });
        })
      );

      return blocks;
    },
  },
  Mutation: {},
};

export default {
  typeDefs,
  resolvers,
};
