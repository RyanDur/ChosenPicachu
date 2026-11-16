import {ComponentProps, DragEventHandler} from 'react';

export type ItemProps = Omit<ComponentProps<'li'>, 'onDragOver'> & {
  item: string;
  onDragOver?: DragEventHandler<HTMLElement>;
};
