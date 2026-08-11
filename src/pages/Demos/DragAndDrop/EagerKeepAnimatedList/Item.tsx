import {DragEventHandler, FC, useState} from 'react';
import {has, maybe} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {array} from '@components/arrays';
import Handle from '@components/grip.svg';
import '../Item.css';

const steps: Record<string, 1 | -1> = {ArrowRight: 1, ArrowLeft: -1};

export type ItemProps = {
  item: string;
  order: readonly string[];
  className?: string;
  onLifted: (item: string) => void;
  onReleased: () => void;
  onDragOver?: DragEventHandler<HTMLElement>;
  onArranged: (after: string[], walker: string, toward: 1 | -1) => void;
};

export const Item: FC<ItemProps> = (
  {item, order, className, onLifted, onReleased, onDragOver, onArranged}
) => {
  const [dragging, updateDragging] = useState(false);

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
      updateDragging(false);
    }}
    draggable={dragging}>
    <button type="button"
            className="grip"
            aria-label={`grip for ${item}`}
            onMouseDown={() => updateDragging(true)}
            onKeyDown={event => maybe(steps[event.key]).map(toward => {
              event.preventDefault();
              const lane = event.currentTarget.closest('li');
              if (has(lane) && lane.getAnimations().length > 0) {
                return;
              }
              const from = order.indexOf(item);
              const to = Math.min(Math.max(from + toward, 0), order.length - 1);
              if (to !== from) {
                onArranged(array.moveToIndex(to, item, order), item, toward);
              }
            })}>
      <Handle/>
    </button>
    <article className="value">{item}</article>
  </article>;
};
