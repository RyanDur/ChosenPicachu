import * as schema from 'schemawax';
import {Align, Entrance, Side, Stack} from './params';

export type BannerSettings = {
  side: Side;
  align: Align;
  enter: Entrance;
  stack: Stack;
};

type BannerDials = {
  decoders: {[K in keyof BannerSettings]: schema.Decoder<BannerSettings[K]>};
  defaults: BannerSettings;
};

export const bannerDials: BannerDials = {
  decoders: {
    side: schema.literalUnion('top', 'middle', 'bottom'),
    align: schema.literalUnion('left', 'center', 'right'),
    enter: schema.literalUnion('above', 'below', 'left', 'right'),
    stack: schema.literalUnion('down', 'up', 'left', 'right')
  },
  defaults: {side: 'top', align: 'center', enter: 'above', stack: 'down'}
};
