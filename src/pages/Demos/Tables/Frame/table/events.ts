import type {ColumnMoved, RowMoved, Sorted} from '@components/DragSortableTable/context';

declare global {
  // augmenting the event map only works through interface merging — a type alias cannot merge
  // oxlint-disable-next-line typescript/consistent-type-definitions
  interface HTMLElementEventMap {
    'column-moved': CustomEvent<ColumnMoved>;
    'row-moved': CustomEvent<RowMoved>;
    'sorted': CustomEvent<Sorted>;
  }
}

type TableEvent = 'column-moved' | 'row-moved' | 'sorted';

export const tell = <Type extends TableEvent>(table: HTMLElement, type: Type, detail: HTMLElementEventMap[Type]['detail']): void => {
  table.dispatchEvent(new CustomEvent(type, {detail}));
};
