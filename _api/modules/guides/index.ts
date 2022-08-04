import { gql } from "apollo-server-micro";
import { Resolvers } from "_api/gql_types";

const typeDefs = gql`
  type Guide {
    id: String
    name: String
  }

  input GuideInput {
    limit: Int
    offset: Int
  }

  # Query
  extend type Query {
    guide(input: GuideInput): Guide
    guides(input: GuideInput): [Guide]!
  }
`;

const resolvers: Resolvers = {
  Query: {
    guides: async () => {
      return [
        {
          id: "1",
          name: "Guide 1",
        },
      ];
    },
    guide: async () => {
      return {
        id: "1",
        name: "Guide 1",
      };
    },
  },
  Mutation: {},
};

export default {
  typeDefs,
  resolvers,
};
