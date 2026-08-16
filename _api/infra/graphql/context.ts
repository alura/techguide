import { Guide } from "@api/gql_types";
import { guidesRepository } from "@api/modules/guides/repository";

export interface GraphQLContext {
  /**
   * Every guide, fetched at most once per request and shared by all resolvers.
   *
   * `Card.expertises`, `Card.collaborations`, `GuideExpertise.guide` and
   * `GuideCollaboration.guide` all need the same full list, and GraphQL calls each of
   * them once per parent item — so without this the same query runs once per card.
   */
  getGuides(): Promise<Guide[]>;
}

export function createContext(): GraphQLContext {
  // The promise itself is cached, not the resolved value: resolvers run concurrently, so
  // memoising after the await would still let several requests go out in parallel.
  let guides: Promise<Guide[]> | undefined;

  return {
    getGuides() {
      if (!guides) {
        guides = guidesRepository().getAll({ input: {} });
      }
      return guides;
    },
  };
}
