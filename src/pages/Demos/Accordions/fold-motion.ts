import * as schema from 'schemawax';

export type FoldMotion = 'reveal' | 'drawer' | 'static';

export const foldMotionParam: schema.Decoder<FoldMotion> = schema.literalUnion('reveal', 'drawer', 'static');
