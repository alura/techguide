import { PageConfig } from "next";
import {
  ApolloServerPluginLandingPageGraphQLPlayground
} from 'apollo-server-core';
import { ApolloServer, gql } from "apollo-server-micro";
import modulesGuides from '@api/modules/guides';

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
  typeDefs: [
    defaultTypeDefs,
    modulesGuides.typeDefs,
  ],
  resolvers: {
    Query: {
      greet: () => 'Welcome to @alura/tshapeddev',
      ...modulesGuides.resolvers.Query,
    },
    Mutation: {
      createSampleText: (_: unknown, args) => args.input.text,
      ...modulesGuides.resolvers.Mutation,
    }
  },
  plugins: [
    process.env.NODE_ENV === 'production' && ApolloServerPluginLandingPageGraphQLPlayground(),
  ].filter(Boolean),
  introspection: true,
};

const apolloServer = new ApolloServer(serverSchema);

const startServer = apolloServer.start();

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.end();
    return false;
  }

  await startServer;
  await apolloServer.createHandler({
    path: "/api/graphql",
  })(req, res);
};


export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};
