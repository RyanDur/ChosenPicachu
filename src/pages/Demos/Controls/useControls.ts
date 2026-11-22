import {useSearchParamsObject} from '@navigation/search-params';
import {Motion, Origin} from '@components/DragSortableTable';
import {Placement, unplaced} from '@banners';
import {
  Address, CardOne, FoldMotion, FoldType, Pace, ParentPosition, PartsList, Position, RaisedCard, readerSettings,
  Track, World, Worn
} from '../ReaderSettings';

export type {Motion, Origin};
export type Settings = Placement & {
  pace: Pace;
  origin: Origin;
  motion: Motion;
  world: World;
  track: Track;
  foldType: FoldType;
  foldMotion: FoldMotion;
  raised: RaisedCard;
  cardOne: CardOne;
  wears: Worn;
  parts: PartsList;
  second: Position;
  parent: ParentPosition;
};

export type Controls = Settings & {change: (next: Partial<Settings>) => void};

const defaults: Address = {
  pace: 'eager',
  origin: 'hide',
  motion: 'animated',
  world: 'react',
  track: 'pointer',
  type: 'exclusive',
  style: 'reveal',
  raised: 'none',
  'card-one': 'contained',
  wears: 'nothing',
  parts: 'shown',
  second: 'static',
  parent: 'positioned',
  ...unplaced
};

export const useControls = (): Controls => {
  const {type, style, 'card-one': cardOne, ...found} = useSearchParamsObject(readerSettings.decoders, defaults);
  return {
    ...found,
    foldType: type,
    foldMotion: style,
    cardOne,
    change: ({foldType, foldMotion, cardOne: nextCardOne, ...next}) =>
      found.updateSearchParams({...next, type: foldType, style: foldMotion, 'card-one': nextCardOne})
  };
};
