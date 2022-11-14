import { initializeApollo } from "@src/infra/apolloClient";
import { log } from "@scripts/modules/infra/log";

export const main = () => {
  log("Is this working?");
  initializeApollo();
};

main();
