import {DragEventHandler} from 'react';

export type ItemProps = {
  item: string;
  order: readonly string[];
  className?: string;
  onLifted: (item: string) => void;
  onReleased: () => void;
  onDragOver?: DragEventHandler<HTMLElement>;
  onArranged: (after: string[], walker: string, toward: 1 | -1) => void;
};
