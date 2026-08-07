import {DragEventHandler, FC, useState} from 'react';
import {has, is} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {array} from '@components/arrays';
import Handle from '@components/grip.svg';
import './Draggable.css';

export type DraggableProps = {
  item: string;
  order: readonly string[];
  className?: string;
  onLifted: (item: string) => void;
  onReleased: () => void;
  onDragOver?: DragEventHandler<HTMLElement>;
  onArranged: (after: string[], walker: string, toward: 1 | -1) => void;
};

export const Draggable: FC<DraggableProps> = (
  {item, order, className, onLifted, onReleased, onDragOver, onArranged}
) => {
  const [dragging, updateDragging] = useState<'dragging'>();

  return <article
    className={classNames('draggable', className)}
    onDragStart={event => {
      event.dataTransfer.effectAllowed = 'move';
      onLifted(item);
    }}
    onDragOver={event => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
      onDragOver?.(event);
    }}
    onDrop={event => event.preventDefault()}
    onDragEnd={() => {
      onReleased();
      updateDragging(undefined);
    }}
    draggable={is(dragging)}>
    <button type="button"
            className="grip"
            aria-label={`grip for ${item}`}
            onMouseDown={() => updateDragging('dragging')}
            onKeyDown={event => {
              if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
                return;
              }
              event.preventDefault();
              const lane = event.currentTarget.closest('li');
              if (has(lane) && (lane.getAnimations?.().length ?? 0) > 0) {
                return;
              }
              const toward = event.key === 'ArrowRight' ? 1 : -1;
              const from = order.indexOf(item);
              const to = Math.min(Math.max(from + toward, 0), order.length - 1);
              if (to === from) {
                return;
              }
              onArranged(array.moveToIndex(to, item, order), item, toward);
            }}>
      <Handle/>
    </button>
    <article className="value">{item}</article>
  </article>;
};
