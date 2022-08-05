export function filterFieldNormalizer<TypeFilter>(filter: TypeFilter) {
  return Object.entries(filter || {}).reduce((acc, [key, value]) => {
    if (typeof value === "object") {
      const resolveValue = (value: string): any => {
        return value;
      };
      return {
        ...acc,
        [key]: Object.keys(value).reduce((acc, k) => {
          return {
            ...acc,
            [`$${k}`]: resolveValue(value[k]),
          };
        }, {}),
      };
    }
    return { ...acc };
  }, {});
}
