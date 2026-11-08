import {ComponentProps, DragEventHandler} from 'react';

export type ItemProps = Omit<ComponentProps<'li'>, 'onDragOver'> & {
  item: string;
  className?: string;
  onDragOver?: DragEventHandler<HTMLElement>;
};
