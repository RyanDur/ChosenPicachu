import {FC} from 'react';
import {has, maybe} from '@ryandur/sand';
import {array} from '@components/arrays';
import Handle from '@components/grip.svg';

const steps: Record<string, 1 | -1> = {ArrowRight: 1, ArrowLeft: -1};

type Props = {
  item: string;
  order: readonly string[];
  onPressed: () => void;
  onReleased: () => void;
  onArranged: (after: string[], walker: string, toward: 1 | -1) => void;
};

export const Grip: FC<Props> = ({item, order, onPressed, onReleased, onArranged}) =>
  <button type="button"
    className="grip handle borderless unfilled focus-ringed reachable"
    aria-label={`grip for ${item}`}
    onPointerDown={onPressed}
    onPointerUp={onReleased}
    onPointerCancel={onReleased}
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
  </button>;
