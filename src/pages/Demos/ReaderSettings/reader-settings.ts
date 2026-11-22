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
export type PartsList = 'shown' | 'hidden';
export type Position = typeof inOrder.positions[number];
export type ParentPosition = typeof inOrder.parentPositions[number];

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
  parts: PartsList;
  second: Position;
  parent: ParentPosition;
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
  wears: schema.literalUnion(...inOrder.worn),
  parts: schema.literalUnion('shown', 'hidden'),
  second: schema.literalUnion(...inOrder.positions),
  parent: schema.literalUnion(...inOrder.parentPositions)
};

const deskParam = 'charts';

const settingParams = [...Object.keys(decoders), deskParam];

type ReaderSettings = {
  decoders: typeof decoders;
  deskParam: typeof deskParam;
  keptFrom: (params: URLSearchParams) => URLSearchParams;
};

export const readerSettings: ReaderSettings = {
  decoders,
  deskParam,
  keptFrom: params => new URLSearchParams([...params].filter(([param]) => settingParams.includes(param)))
};
