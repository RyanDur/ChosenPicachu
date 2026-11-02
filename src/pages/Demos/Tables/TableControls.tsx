import {FC} from 'react';
import {useSearchParamsObject} from '@components/search-params';
import {Controls, Copy, defaultMotion, defaultOrigin, defaultPace, motionParam, originParam, paceParam} from '../Controls';
import {World} from './params';
import {capitalized} from '../capitalized';

const copy: Copy = {
  kind: 'table',
  readout: (pace, origin, motion) => `<${capitalized(pace)}Table className="${origin} ${motion}"/>`,
  pace: {
    eager: 'Neighbors swap the moment you drag past them, so the order is already settled when you let go.',
    lazy: 'The table holds its shape while you drag and dispatches the new order on drop.'
  },
  origin: {
    keep: 'The lifted row or column stays where it was, so you can see the gap it will leave.',
    hide: 'The lifted row or column moves with the pointer, cells and all, leaving its gap where it came from.'
  },
  motion: {
    animated: 'The swap itself is instant; displaced cells slide to their new places.',
    static: 'The same marks land, and the style sheet gives them no time: cells cut to their new places.'
  }
};

export const TableControls: FC<{world: World}> = ({world}) => {
  const {pace = defaultPace, origin = defaultOrigin, motion = defaultMotion, updateSearchParams} =
    useSearchParamsObject({pace: paceParam, origin: originParam, motion: motionParam});
  return <Controls copy={{...copy, readout: (pace, origin, motion) => world === 'vanilla' ? '<TableFrame/>' : copy.readout(pace, origin, motion)}}
    pace={pace} origin={origin} motion={motion}
    onPaceChosen={next => updateSearchParams({pace: next})}
    onOriginChosen={next => updateSearchParams({origin: next})}
    onMotionChosen={next => updateSearchParams({motion: next})}/>;
};
