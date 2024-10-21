import {DragEvent, FC, PropsWithChildren, useState} from 'react';
import {classNames} from '../../../util/classNames';
import Handle from './grip.svg';
import {PropsWithClassName} from '../../_types';
import {is} from '@ryandur/sand';

export type DraggableListItemProps = PropsWithChildren & PropsWithClassName & {
  label: string;
  onDragOver: (event: DragEvent<HTMLElement>) => void;
  onDragStart: (event: DragEvent<HTMLElement>) => void;
  onDragEnd: (event: DragEvent<HTMLElement>) => void;
};

export const Draggable: FC<DraggableListItemProps> = ({
  label,
  onDragOver,
  onDragStart,
  onDragEnd,
  children,
  className
}) => {
  const [dragging, updateDragging] = useState<'dragging'>();

  return <article
    className={classNames('draggable', dragging, className)}
    onDragStart={(event: DragEvent<HTMLElement>) => {
      onDragStart(event);
    }}
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

const Grip: FC<{
  label: string,
  onMouseUp: () => void,
  onMouseDown: () => void
}> = ({
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