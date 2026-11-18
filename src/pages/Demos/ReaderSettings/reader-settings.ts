import * as schema from 'schemawax';
import type {Placement} from '@banners';
import type {Motion, Origin} from '@components/DragSortableTable';
import {inOrder} from './in-order';

export type Pace = 'eager' | 'lazy';
export type World = 'react' | 'vanilla';
export type Track = 'pointer' | 'keyboard';
export type FoldType = 'inclusive' | 'exclusive';
export type FoldMotion = 'reveal' | 'drawer' | 'static';
export type RaisedCard = typeof inOrder.raisedCards[number];
export type CardOne = 'contained' | 'free';
export type Worn = typeof inOrder.worn[number];

export type Address = Placement & {
  pace: Pace;
  origin: Origin;
  motion: Motion;
  world: World;
  track: Track;
  raised: RaisedCard;
  wears: Worn;
  type: FoldType;
  style: FoldMotion;
  'card-one': CardOne;
};

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
  stack: schema.literalUnion('down', 'up', 'left', 'right'),
  raised: schema.literalUnion(...inOrder.raisedCards),
  'card-one': schema.literalUnion('contained', 'free'),
  wears: schema.literalUnion(...inOrder.worn)
};

const settingParams = [...Object.keys(decoders), 'charts'];

export const readerSettings = {
  decoders,
  keptFrom: (params: URLSearchParams): URLSearchParams =>
    new URLSearchParams([...params].filter(([param]) => settingParams.includes(param)))
};
