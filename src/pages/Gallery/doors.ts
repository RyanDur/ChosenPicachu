import {Source} from '@pages/Gallery/source';
import {Door} from '@pages/Gallery/museums';

export type Doors = Record<Source, Door | 'unknown'>;

type DoorAnswered = {readonly type: 'answered'; readonly museum: Source; readonly door: Door};

const noneAnswered: Doors = {
  [Source.AIC]: 'unknown',
  [Source.HARVARD]: 'unknown',
  [Source.VAM]: 'unknown',
  [Source.CLEVELAND]: 'unknown'
};

export const doors = {
  initial: noneAnswered,
  answered: (museum: Source, door: Door): DoorAnswered => ({type: 'answered', museum, door}),
  reduce: (known: Doors, {museum, door}: DoorAnswered): Doors => ({...known, [museum]: door})
};
