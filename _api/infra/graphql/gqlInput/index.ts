import { filterFieldNormalizer } from "../filterFieldNormalizer";

export function gqlInput<Input>(input: any): Input {
  return {
    ...input,
    filter: filterFieldNormalizer(input?.filter),
  };
}
