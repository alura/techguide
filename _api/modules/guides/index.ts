import _ from "lodash";
import { gql } from "apollo-server-micro";
import { Resolvers } from "@api/gql_types";
import { guidesRepository } from "@api/modules/guides/repository";
import { gqlInput } from "@api/infra/graphql/gqlInput";
import { blocksRepository } from "../blocks/repository";

const typeDefs = gql`
  type GuideBlock {
    priority: Int
    item: Block
  }

  type GuideExpertise {
    name: String
    blocks: [GuideBlock]
    guide: Guide
  }
  type GuideCollaboration {
    name: String
    blocks: [GuideBlock]
    guide: Guide
  }

  type Guide {
    id: String
    slug: String
    name: String
    expertises: [GuideExpertise]
    collaborations: [GuideCollaboration]
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
  },
  GuideCollaboration: {
    async guide(parent) {
      const guides = await guidesRepository().getAll({ input: {} });
      return _.find(guides, (guide) => {
        return _.some(guide.collaborations, { name: parent.name });
      });
    },
  },
  GuideBlock: {
    async item(parent) {
      return blocksRepository().getBySlug({
        input: gqlInput({ slug: parent.item.slug }),
      });
    },
  },
  Mutation: {},
};

export default {
  typeDefs,
  resolvers,
};
