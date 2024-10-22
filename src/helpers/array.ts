export const array = {
  removeFrom: <T>(itemToRemove: T, list: T[]) => {
    const index = list.indexOf(itemToRemove);
    return [...list.slice(0, index), ...list.slice(index + 1)];
  },
  insertAt: <T>(
    index: number,
    item: T,
    list: T[]
  ): T[] => [...list.slice(0, index), item, ...list.slice(index)],
  moveToIndex: <T>(
    index: number,
    item: T,
    list: T[]
  ): T[] =>
    list.includes(item)
      ? array.insertAt(index, item, array.removeFrom(item, list))
      : list
};