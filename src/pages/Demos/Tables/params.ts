import * as D from 'schemawax';

export type Track = 'pointer' | 'keyboard';

export const trackParam: D.Decoder<Track> = D.literalUnion('pointer', 'keyboard');

export type Tutorial = 'sort' | 'menu' | 'resize';

export const tutorialParam: D.Decoder<Tutorial> = D.literalUnion('sort', 'menu', 'resize');
