import * as schema from 'schemawax';
import {inOrder} from './inOrder';
import type {Address} from './useControls';

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

const readerSettings = [...Object.keys(decoders), 'charts'];

export const dialParams = {
  decoders,
  keptFrom: (params: URLSearchParams): URLSearchParams =>
    new URLSearchParams([...params].filter(([param]) => readerSettings.includes(param)))
};
