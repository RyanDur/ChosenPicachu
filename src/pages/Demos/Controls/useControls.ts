import * as schema from 'schemawax';
import {useSearchParamsObject} from '@components/search-params';
import {Motion, Origin} from '@components/DragSortableTable';
import {Align, alignParam, enterParam, Entrance, Side, sideParam, Stack, stackParam} from '@components/Banners';

export type {Motion, Origin};
export type Pace = 'eager' | 'lazy';
export type World = 'react' | 'vanilla';
export type Track = 'pointer' | 'keyboard';

export type Settings = {
  pace: Pace;
  origin: Origin;
  motion: Motion;
  world: World;
  track: Track;
  align: Align;
  side: Side;
  enter: Entrance;
  stack: Stack;
};

export type Controls = Settings & {change: (next: Partial<Settings>) => void};

const decoders: {[K in keyof Settings]: schema.Decoder<Settings[K]>} = {
  pace: schema.literalUnion('eager', 'lazy'),
  origin: schema.literalUnion('keep', 'hide'),
  motion: schema.literalUnion('animated', 'static'),
  world: schema.literalUnion('react', 'vanilla'),
  track: schema.literalUnion('pointer', 'keyboard'),
  align: alignParam,
  side: sideParam,
  enter: enterParam,
  stack: stackParam
};

const defaults: Settings = {
  pace: 'eager',
  origin: 'hide',
  motion: 'animated',
  world: 'react',
  track: 'pointer',
  align: 'center',
  side: 'top',
  enter: 'above',
  stack: 'down'
};

export const useControls = (): Controls => {
  const found = useSearchParamsObject(decoders, defaults);
  return {...found, change: next => found.updateSearchParams(next)};
};
