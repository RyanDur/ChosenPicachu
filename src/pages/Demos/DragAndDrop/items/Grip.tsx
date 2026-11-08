import {FC} from 'react';
import {maybe} from '@ryandur/sand';
import Handle from '@components/grip.svg';
import {useHydrated} from '@components';
import {dragSortChange} from '../drag-sort-change';
import {useDragSortDispatch} from '../useDragSortDispatch';

const steps: Record<string, 1 | -1> = {ArrowRight: 1, ArrowLeft: -1};

export const Grip: FC<{item: string}> = ({item}) => {
  const dispatch = useDragSortDispatch();

  return <button type="button"
    disabled={!useHydrated()}
    className="grip handle borderless unfilled focus-ringed reachable"
    aria-label={`grip for ${item}`}
    onPointerDown={() => dispatch(dragSortChange.gripped(item))}
    onPointerUp={() => dispatch(dragSortChange.letGo())}
    onPointerCancel={() => dispatch(dragSortChange.letGo())}
    onKeyDown={event => maybe(steps[event.key]).map(step => {
      event.preventDefault();
      dispatch(dragSortChange.stepped(item, step));
    })}>
    <Handle/>
  </button>;
};
