import {DragEvent, DragEventHandler, FC, PropsWithChildren, useState} from 'react';
import {classNames} from '../../../util/classNames';
import Handle from './grip.svg';
import {PropsWithClassName} from '../../_types';
import {is} from '@ryandur/sand';

export type DraggableListItemProps = PropsWithChildren & PropsWithClassName & {
  label: string;
  onDragOver: DragEventHandler<HTMLElement>;
  onDragStart: DragEventHandler<HTMLElement>;
  onDragEnd: DragEventHandler<HTMLElement>;
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
      onDragOver(event);
    }}
    onDragEnd={(event: DragEvent<HTMLElement>) => {
      event.preventDefault();
      updateDragging(undefined);
      onDragEnd(event);
    }}
    draggable={is(dragging)} key={label}>
    <Grip
      label={label}
      onMouseUp={() => updateDragging(undefined)}
      onMouseDown={() => updateDragging('dragging')}/>
    <article className='value'>{children}</article>
  </article>;
};

type GripProps = {
  label: string,
  onMouseUp: () => void,
  onMouseDown: () => void
};
const Grip: FC<GripProps> = ({
  label,
  onMouseDown,
  onMouseUp,
}) =>
  <article
    className='grip'
    aria-label={`grip for ${label}`}
    onMouseUp={onMouseUp}
    onMouseDown={onMouseDown}>
    <Handle/>
  </article>;