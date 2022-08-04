import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { ApolloServer, gql } from "apollo-server-micro";
import modulesGuides from "_api/modules/guides";
export { gql } from "apollo-server-micro";

const defaultTypeDefs = gql`
  # Commons
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
  typeDefs: [defaultTypeDefs, modulesGuides.typeDefs],
  resolvers: {
    Query: {
      greet: () => "Welcome to @alura/tshapeddev",
      ...modulesGuides.resolvers.Query,
    },
    Mutation: {
      createSampleText: (_: unknown, args) => args.input.text,
      ...modulesGuides.resolvers.Mutation,
    },
  },
  plugins: [
    process.env.NODE_ENV === "production" &&
      ApolloServerPluginLandingPageGraphQLPlayground(),
  ].filter(Boolean),
  introspection: true,
};

export const apolloServer = new ApolloServer(serverSchema);
