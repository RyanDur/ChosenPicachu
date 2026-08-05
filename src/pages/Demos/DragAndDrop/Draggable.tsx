import {DragEvent, DragEventHandler, FC, KeyboardEvent, PropsWithChildren, useState} from 'react';
import {classNames} from '@components/class-names';
import Handle from '@components/grip.svg';
import {PropsWithClassName} from '../types';
import {is} from '@ryandur/sand';

export type DraggableListItemProps = PropsWithChildren & PropsWithClassName & {
  label: string;
  onDragOver?: DragEventHandler<HTMLElement>;
  onDragStart?: DragEventHandler<HTMLElement>;
  onDragEnd?: DragEventHandler<HTMLElement>;
  onNudge?: (toward: 1 | -1, event: KeyboardEvent<HTMLElement>) => void;
};

export const Draggable: FC<DraggableListItemProps> = ({
  label,
  onDragOver,
  onDragEnd,
  onDragStart,
  onNudge,
  children,
  className,
  ...rest
}) => {
  const [dragging, updateDragging] = useState<'dragging'>();

  return <article
    {...rest}
    className={classNames('draggable', className)}
    onDragStart={event => {
      event.dataTransfer.effectAllowed = 'move';
      onDragStart?.(event);
    }}
    onDragOver={event => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
      onDragOver?.(event);
    }}
    onDrop={event => event.preventDefault()}
    onDragEnd={(event: DragEvent<HTMLElement>) => {
      onDragEnd?.(event);
      updateDragging(undefined);
    }}
    draggable={is(dragging)} key={label}>
    <Grip
      label={label}
      onMouseDown={() => updateDragging('dragging')}
      onNudge={onNudge}/>
    <article className='value'>{children}</article>
  </article>;
};

type GripProps = {
  label: string,
  onMouseDown: () => void,
  onNudge?: (toward: 1 | -1, event: KeyboardEvent<HTMLElement>) => void
};
const Grip: FC<GripProps> = ({
  label,
  onMouseDown,
  onNudge,
}) =>
  <button
    type='button'
    className='grip'
    aria-label={`grip for ${label}`}
    onMouseDown={onMouseDown}
    onKeyDown={event => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
        return;
      }
      event.preventDefault();
      onNudge?.(event.key === 'ArrowRight' ? 1 : -1, event);
    }}>
    <Handle/>
  </button>;