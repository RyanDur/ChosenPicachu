import * as schema from 'schemawax';

export type RaisedCard = 'none' | 'first' | 'second' | 'third';

export const raisedParam: schema.Decoder<RaisedCard> = schema.literalUnion('none', 'first', 'second', 'third');
