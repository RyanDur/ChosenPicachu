import {useSearchParamsObject} from '@navigation/search-params';
import {Motion, Origin} from '@components/DragSortableTable';
import {Placement, unplaced} from '@banners';
import {
  Address, CardOne, FoldMotion, FoldType, Pace, ParentPosition, PartsShown, Position, RaisedCard, readerSettings,
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
  parts: PartsShown;
  chosenPosition: Position;
  chosenParentPosition: ParentPosition;
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
  'second-position': 'static',
  'parent-position': 'positioned',
  ...unplaced
};

export const useControls = (): Controls => {
  const {
    type, style, 'card-one': cardOne, 'second-position': chosenPosition, 'parent-position': chosenParentPosition, ...found
  } = useSearchParamsObject(readerSettings.decoders, defaults);
  return {
    ...found,
    foldType: type,
    foldMotion: style,
    cardOne,
    chosenPosition,
    chosenParentPosition,
    change: ({
      foldType, foldMotion, cardOne: nextCardOne, chosenPosition: nextSecond, chosenParentPosition: nextParent, ...next
    }) => found.updateSearchParams({
      ...next, type: foldType, style: foldMotion, 'card-one': nextCardOne,
      'second-position': nextSecond, 'parent-position': nextParent
    })
  };
};
