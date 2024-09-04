export function permutations<T>(array: T[], start = 0): T[][] {
  if (start === array.length) return [[]];
  const item = array[start];
  const results: T[][] = [];
  permutations<T>(array, start + 1).forEach(perm => {
    perm.forEach((_, i) => {
      const copy = perm.slice(0);
      copy.splice(i, 0, item);
      results.push(copy);
    });
    results.push(perm.concat(item));
  });
  return results;
}
