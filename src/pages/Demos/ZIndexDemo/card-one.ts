import * as schema from 'schemawax';

export type CardOne = 'contained' | 'free';

export const cardOneParam: schema.Decoder<CardOne> = schema.literalUnion('contained', 'free');
