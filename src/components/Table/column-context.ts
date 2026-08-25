import {MouseEvent, createContext, useContext} from 'react';
import {Direction} from '@components/DragSortableTable/sorting';

export type ColumnContext = {
  name: string;
  share: number | undefined;
  onAwaken: (table: HTMLTableElement) => void;
  onTrade: (delta: number) => void;
  onRule: (direction: Direction | undefined, event: MouseEvent<HTMLButtonElement>) => void;
};

const unplaced: ColumnContext = {
  name: '',
  share: undefined,
  onAwaken: () => undefined,
  onTrade: () => undefined,
  onRule: () => undefined
};

export const ColumnSetting = createContext<ColumnContext>(unplaced);

export const useColumn = (): ColumnContext => useContext(ColumnSetting);
