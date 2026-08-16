import * as schema from 'schemawax';

export type Track = 'pointer' | 'keyboard';

export const trackParam: schema.Decoder<Track> = schema.literalUnion('pointer', 'keyboard');

export type Tutorial = 'sort' | 'menu' | 'resize';

export const tutorialParam: schema.Decoder<Tutorial> = schema.literalUnion('sort', 'menu', 'resize');

export type World = 'react' | 'vanilla';

export const worldParam: schema.Decoder<World> = schema.literalUnion('react', 'vanilla');
