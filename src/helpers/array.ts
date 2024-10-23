import {empty, has} from '@ryandur/sand';

const removeFrom = <T>(itemToRemove: T, list: T[]) => {
  const index = list.indexOf(itemToRemove);
  return [...list.slice(0, index), ...list.slice(index + 1)];
};

const insertAt = <T>(
  index: number,
  item: T,
  list: T[]
): T[] => [...list.slice(0, index), item, ...list.slice(index)];

const moveToIndex = <T>(
  index: number,
  item: T,
  list: T[]
): T[] =>
  list.includes(item)
    ? insertAt(index, item, removeFrom(item, list))
    : list;

const removeFromGrid = <T>(
  item: T,
  grid: T[][]
): T[][] => grid
  .map(row => row.includes(item) ? removeFrom(item, row) : row)
  .filter(has);

const addToGrid = <T>(
  row: number,
  column: number,
  item: T,
  grid: T[][]
) => {
  const safeRow = row >= 0 ? row : 0;
  const currentRow = grid[safeRow] ?? [];
  if (empty(currentRow)) {
    return insertAt(safeRow, [item], grid);
  } else {
    const newGrid = removeFrom(currentRow, grid);
    const newRow = insertAt(column, item, currentRow);
    return insertAt(safeRow, newRow, newGrid);
  }
};

const moveToRowColumn = <T>(
  row: number,
  column: number,
  item: T,
  grid: T[][]
) => addToGrid(row, column, item, removeFromGrid(item, grid));

export const array = {
  removeFrom,
  insertAt,
  moveToIndex,
  removeFromGrid,
  moveToRowColumn,
  addToGrid
};