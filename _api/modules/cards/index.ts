import { gql } from "apollo-server-micro";
import { Resolvers, SiteLocale } from "@api/gql_types";
import { cardsRepository } from "@api/modules/cards/repository";
import { gqlInput } from "@api/infra/graphql/gqlInput";
import { guidesRepository } from "../guides/repository";
import _ from "lodash";

const typeDefs = gql`
  # Types
  type CardKeyObjective {
    id: String
    slug: String
    name: String
  }
  type CardAditionalObjective {
    id: String
    slug: String
    name: String
  }
  type CardContent {
    id: String
    slug: String
    type: CardContentType
    title: String
    link: String
  }
  enum CardContentType {
    SITE
    COURSE
    ALURAPLUS
    PODCAST
    ARTICLE
    YOUTUBE
    CHALLENGE
    BOOK
  }
  type Card {
    id: String
    slug: String
    name: String
    logo: String
    shortDescription: String
    keyObjectives: [CardKeyObjective]
    aditionalObjectives: [CardAditionalObjective]
    contents: [CardContent]
    aluraContents: [CardContent]
    expertises: [GuideExpertise]
    collaborations: [GuideCollaboration]
  }

  # Filters
  input CardFilters {
    id: FieldFilter
    slug: FieldFilter
    name: FieldFilter
  }

  # Query
  input CardsInput {
    limit: Int
    offset: Int
    filter: CardFilters
    locale: SiteLocale
  }
  input CardInput {
    slug: String!
  }
  extend type Query {
    card(input: CardInput, locale: SiteLocale): Card
    cards(input: CardsInput, locale: SiteLocale): [Card]!
  }
`;

const resolvers: Resolvers = {
  Card: {
    async expertises(parent) {
      const guides = await guidesRepository().getAll({ input: {} });
      const expertises = guides
        .map((guide) => {
          return guide.expertises;
        })
        .flatMap((expertise) => expertise);

      return _.filter(expertises, (expertise) => {
        return _.some(expertise.cards, { item: { slug: parent.slug } });
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
        return _.some(collaboration.cards, { item: { slug: parent.slug } });
      });
    },
  },
  Query: {
    async cards(_, { input, locale }) {
      const cards = await cardsRepository().getAll({
        input: gqlInput({
          ...input,
          locale: locale || SiteLocale.PtBr,
        }),
      });
      return cards;
    },
    async card(_, { input, locale }) {
      const card = await cardsRepository().getBySlug({
        input: gqlInput({
          ...input,
          locale: locale || SiteLocale.PtBr,
        }),
      });
      return card;
    },
  },
  Mutation: {},
};

export default {
  typeDefs,
  resolvers,
};
