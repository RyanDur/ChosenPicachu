import {useSearchParamsObject} from '@navigation/search-params';
import {Motion, Origin} from '@components/DragSortableTable';
import {Placement, unplaced} from '@banners';
import {
  Address, FoldMotion, FoldType, Pace, ParentPosition, PartsShown, Position, RaisedCard, readerSettings, Track, World,
  Worn
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
  wears: 'nothing',
  parts: 'shown',
  'second-position': 'static',
  'parent-position': 'positioned',
  ...unplaced
};

export const useControls = (): Controls => {
  const {
    type, style, 'second-position': chosenPosition, 'parent-position': chosenParentPosition, ...found
  } = useSearchParamsObject(readerSettings.decoders, defaults);
  return {
    ...found,
    foldType: type,
    foldMotion: style,
    chosenPosition,
    chosenParentPosition,
    change: ({
      foldType, foldMotion, chosenPosition: nextSecond, chosenParentPosition: nextParent, ...next
    }) => found.updateSearchParams({
      ...next, type: foldType, style: foldMotion,
      'second-position': nextSecond, 'parent-position': nextParent
    })
  };
};
