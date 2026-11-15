import * as schema from 'schemawax';
import {useSearchParamsObject} from '@navigation/search-params';
import {Motion, Origin} from '@components/DragSortableTable';
import {Placement, unplaced} from '@banners';

export type {Motion, Origin};
export type Pace = 'eager' | 'lazy';
export type World = 'react' | 'vanilla';
export type Track = 'pointer' | 'keyboard';
export type FoldType = 'inclusive' | 'exclusive';
export type FoldMotion = 'reveal' | 'drawer' | 'static';

export type Settings = Placement & {
  pace: Pace;
  origin: Origin;
  motion: Motion;
  world: World;
  track: Track;
  foldType: FoldType;
  foldMotion: FoldMotion;
};

export type Controls = Settings & {change: (next: Partial<Settings>) => void};

// links saved before the fold settings had their own names carry them as type and style
type Address = Omit<Settings, 'foldType' | 'foldMotion'> & {type: FoldType; style: FoldMotion};

const decoders: {[K in keyof Address]: schema.Decoder<Address[K]>} = {
  pace: schema.literalUnion('eager', 'lazy'),
  origin: schema.literalUnion('keep', 'hide'),
  motion: schema.literalUnion('animated', 'static'),
  world: schema.literalUnion('react', 'vanilla'),
  track: schema.literalUnion('pointer', 'keyboard'),
  type: schema.literalUnion('inclusive', 'exclusive'),
  style: schema.literalUnion('reveal', 'drawer', 'static'),
  side: schema.literalUnion('top', 'middle', 'bottom'),
  align: schema.literalUnion('left', 'center', 'right'),
  enter: schema.literalUnion('above', 'below', 'left', 'right'),
  stack: schema.literalUnion('down', 'up', 'left', 'right')
};

const defaults: Address = {
  pace: 'eager',
  origin: 'hide',
  motion: 'animated',
  world: 'react',
  track: 'pointer',
  type: 'exclusive',
  style: 'reveal',
  ...unplaced
};

export const useControls = (): Controls => {
  const {type, style, ...found} = useSearchParamsObject(decoders, defaults);
  return {
    ...found,
    foldType: type,
    foldMotion: style,
    change: ({foldType, foldMotion, ...next}) => found.updateSearchParams({...next, type: foldType, style: foldMotion})
  };
};
