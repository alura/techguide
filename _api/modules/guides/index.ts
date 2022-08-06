import { gql } from "apollo-server-micro";
import { Resolvers } from "@api/gql_types";
import { guidesRepository } from "@api/modules/guides/repository";
import { gqlInput } from "@api/infra/graphql/gqlInput";

const typeDefs = gql`
  type Blocks {
    id: String
    slug: String
    priority: Int
  }

  # ============================================================

  type GuideExpertise {
    name: String
    blocks: [Blocks]
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
  Mutation: {},
};

export default {
  typeDefs,
  resolvers,
};
