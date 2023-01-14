import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { ApolloServer, gql } from "apollo-server-micro";
import { InMemoryLRUCache } from "@apollo/utils.keyvaluecache";
import { UUIDDefinition } from "graphql-scalars";
export { gql } from "apollo-server-micro";
// [Modules]
import modulesGuides from "_api/modules/guides";
import modulesCards from "@api/modules/cards";

const customScalars = [UUIDDefinition];

const defaultTypeDefs = gql`
  # Commons
  enum SiteLocale {
    PT_BR
    EN_US
    ES
  }

  input FieldFilter {
    gte: String
    lt: String
    eq: String
  }
  # ====================================================
  input CreateSampleTextInput {
    text: String!
  }
  # ====================================================
  type Mutation {
    createSampleText(input: CreateSampleTextInput): String!
  }
  type Query {
    greet: String
  }
`;

const serverSchema = {
  typeDefs: [
    ...customScalars,
    defaultTypeDefs,
    modulesGuides.typeDefs,
    modulesCards.typeDefs,
  ],
  resolvers: {
    ...modulesGuides.resolvers,
    ...modulesCards.resolvers,
    Query: {
      greet: () => "Welcome to @alura/tshapeddev",
      ...modulesGuides.resolvers.Query,
      ...modulesCards.resolvers.Query,
    },
    Mutation: {
      createSampleText: (_: unknown, args) => args.input.text,
      ...modulesGuides.resolvers.Mutation,
      ...modulesCards.resolvers.Mutation,
    },
  },
  plugins: [
    process.env.NODE_ENV === "production" &&
      ApolloServerPluginLandingPageGraphQLPlayground(),
  ].filter(Boolean),
  introspection: true,
  cache: new InMemoryLRUCache({
    // ~100MiB
    maxSize: Math.pow(2, 20) * 100,
    // 5 minutes (in milliseconds)
    ttl: 300_000,
  }),
};

export const apolloServer = new ApolloServer(serverSchema);
