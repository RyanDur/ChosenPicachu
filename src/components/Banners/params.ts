import * as schema from 'schemawax';

export type Side = 'top' | 'middle' | 'bottom';
export type Align = 'left' | 'center' | 'right';
export type Entrance = 'above' | 'below' | 'left' | 'right';
export type Stack = 'down' | 'up' | 'left' | 'right';

export const sideParam: schema.Decoder<Side> = schema.literalUnion('top', 'middle', 'bottom');
export const alignParam: schema.Decoder<Align> = schema.literalUnion('left', 'center', 'right');
export const enterParam: schema.Decoder<Entrance> = schema.literalUnion('above', 'below', 'left', 'right');
export const stackParam: schema.Decoder<Stack> = schema.literalUnion('down', 'up', 'left', 'right');
