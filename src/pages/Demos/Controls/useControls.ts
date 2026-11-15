import * as schema from 'schemawax';
import {useSearchParamsObject} from '@navigation/search-params';
import {Motion, Origin} from '@components/DragSortableTable';
import {Placement, unplaced} from '@banners';
import {inOrder} from './inOrder';

export type {Motion, Origin};
export type Pace = 'eager' | 'lazy';
export type World = 'react' | 'vanilla';
export type Track = 'pointer' | 'keyboard';
export type FoldType = 'inclusive' | 'exclusive';
export type FoldMotion = 'reveal' | 'drawer' | 'static';
export type RaisedCard = typeof inOrder.raisedCards[number];
export type CardOne = 'contained' | 'free';
export type Worn = typeof inOrder.worn[number];

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
};

export type Controls = Settings & {change: (next: Partial<Settings>) => void};

type Address = Omit<Settings, 'foldType' | 'foldMotion' | 'cardOne'> & {
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
  ...unplaced
};

export const useControls = (): Controls => {
  const {type, style, 'card-one': cardOne, ...found} = useSearchParamsObject(decoders, defaults);
  return {
    ...found,
    foldType: type,
    foldMotion: style,
    cardOne,
    change: ({foldType, foldMotion, cardOne: nextCardOne, ...next}) =>
      found.updateSearchParams({...next, type: foldType, style: foldMotion, 'card-one': nextCardOne})
  };
};
