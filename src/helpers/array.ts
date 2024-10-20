export const array = {
  removeFrom: <T>(itemToRemove: T, list: T[]) => list.filter(item => item !== itemToRemove),
  insertAt: <T>(
    index: number,
    item: T,
    list: T[]
  ): T[] => {
    return [...list.slice(0, index), item, ...list.slice(index)];
  },
  moveToIndex: <T>(
    index: number,
    item: T,
    list: T[]
  ): T[] =>
    list.includes(item)
      ? array.insertAt(index, item, array.removeFrom(item, list))
      : list
};