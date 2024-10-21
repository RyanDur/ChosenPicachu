import {DragEvent, DragEventHandler, FC, PropsWithChildren, useState} from 'react';
import {classNames} from '../../../util/classNames';
import Handle from './grip.svg';
import {PropsWithClassName} from '../../_types';
import {is} from '@ryandur/sand';

export type DraggableListItemProps = PropsWithChildren & PropsWithClassName & {
  label: string;
  onDragOver?: DragEventHandler<HTMLElement>;
  onDragStart?: DragEventHandler<HTMLElement>;
  onDragEnd?: DragEventHandler<HTMLElement>;
};

export const Draggable: FC<DraggableListItemProps> = ({
  label,
  onDragOver,
  onDragEnd,
  children,
  className,
  ...rest
}) => {
  const [dragging, updateDragging] = useState<'dragging'>();

  return <article
    {...rest}
    className={classNames('draggable', dragging, className)}
    onDragOver={event => {
      event.preventDefault();
      onDragOver?.(event);
    }}
    onDragEnd={(event: DragEvent<HTMLElement>) => {
      event.preventDefault();
      onDragEnd?.(event);
    }}
    onDrop={() => updateDragging(undefined)}
    draggable={is(dragging)} key={label}>
    <Grip
      label={label}
      onMouseDown={() => updateDragging('dragging')}/>
    <article className='value'>{children}</article>
  </article>;
};

type GripProps = {
  label: string,
  onMouseDown: () => void
};
const Grip: FC<GripProps> = ({
  label,
  onMouseDown,
}) =>
  <article
    className='grip'
    aria-label={`grip for ${label}`}
    onMouseDown={onMouseDown}>
    <Handle/>
  </article>;