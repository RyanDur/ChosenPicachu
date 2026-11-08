import * as schema from 'schemawax';
import {useSearchParamsObject} from '@navigation/search-params';
import {Motion, Origin} from '@components/DragSortableTable';
import {Placement, unplaced} from '@notices/Banners';

export type {Motion, Origin};
export type Pace = 'eager' | 'lazy';
export type World = 'react' | 'vanilla';
export type Track = 'pointer' | 'keyboard';

export type Settings = Placement & {
  pace: Pace;
  origin: Origin;
  motion: Motion;
  world: World;
  track: Track;
};

export type Controls = Settings & {change: (next: Partial<Settings>) => void};

const decoders: {[K in keyof Settings]: schema.Decoder<Settings[K]>} = {
  pace: schema.literalUnion('eager', 'lazy'),
  origin: schema.literalUnion('keep', 'hide'),
  motion: schema.literalUnion('animated', 'static'),
  world: schema.literalUnion('react', 'vanilla'),
  track: schema.literalUnion('pointer', 'keyboard'),
  side: schema.literalUnion('top', 'middle', 'bottom'),
  align: schema.literalUnion('left', 'center', 'right'),
  enter: schema.literalUnion('above', 'below', 'left', 'right'),
  stack: schema.literalUnion('down', 'up', 'left', 'right')
};

const defaults: Settings = {
  pace: 'eager',
  origin: 'hide',
  motion: 'animated',
  world: 'react',
  track: 'pointer',
  ...unplaced
};

export const useControls = (): Controls => {
  const found = useSearchParamsObject(decoders, defaults);
  return {...found, change: next => found.updateSearchParams(next)};
};
