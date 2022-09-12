export function paginate<ItemType>(
  array: ItemType[],
  page_size = 10,
  page_number = 1
): ItemType[] {
  // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
  return array.slice((page_number - 1) * page_size, page_number * page_size);
}
