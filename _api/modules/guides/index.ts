import _ from "lodash";
import { gql } from "apollo-server-micro";
import { Resolvers } from "@api/gql_types";
import { guidesRepository } from "@api/modules/guides/repository";
import { gqlInput } from "@api/infra/graphql/gqlInput";
import { cardsRepository } from "../cards/repository";

const typeDefs = gql`
  type GuideCard {
    priority: Int
    item: Card
    optional: Boolean
  }

  type GuideExpertise {
    name: String
    cards: [GuideCard]
    guide: Guide
  }
  type GuideCollaboration {
    name: String
    cards: [GuideCard]
    guide: Guide
  }

  type GuideFAQ {
    title: String
    answer: String
  }

  type Guide {
    id: String
    slug: String
    name: String
    tags: [String]
    expertises: [GuideExpertise]
    collaborations: [GuideCollaboration]
    video: String
    faq: [GuideFAQ]
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
    locale: SiteLocale
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
    async guides(_, { input, locale }) {
      const guides = await guidesRepository().getAll({
        input: gqlInput({
          ...input,
          locale,
        }),
      });

      return guides;
    },
    async guide(_, { input, locale }) {
      const guide = await guidesRepository().getBySlug({
        input: gqlInput({
          ...input,
          locale,
        }),
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
  GuideCard: {
    async item(parent, _, __, args) {
      return cardsRepository().getBySlug({
        input: gqlInput({
          slug: parent.item.slug,
          locale: args.variableValues.locale,
        }),
      });
    },
  },
  Mutation: {},
};

export default {
  typeDefs,
  resolvers,
};
