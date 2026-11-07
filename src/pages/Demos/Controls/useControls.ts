import * as schema from 'schemawax';
import {useSearchParamsObject} from '@components/search-params';
import {Motion, Origin} from '@components/DragSortableTable';
import {BannerSettings, bannerDials} from '@components/Banners';

export type {Motion, Origin};
export type Pace = 'eager' | 'lazy';
export type World = 'react' | 'vanilla';
export type Track = 'pointer' | 'keyboard';

export type Settings = BannerSettings & {
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
  ...bannerDials.decoders
};

const defaults: Settings = {
  pace: 'eager',
  origin: 'hide',
  motion: 'animated',
  world: 'react',
  track: 'pointer',
  ...bannerDials.defaults
};

export const useControls = (): Controls => {
  const found = useSearchParamsObject(decoders, defaults);
  return {...found, change: next => found.updateSearchParams(next)};
};
