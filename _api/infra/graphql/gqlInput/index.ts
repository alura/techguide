import { filterFieldNormalizer } from "../filterFieldNormalizer";

export function gqlInput<Input>(input: Input): Input {
  return {
    ...input,
    filter: filterFieldNormalizer((input as unknown as any)?.filter),
  };
}
