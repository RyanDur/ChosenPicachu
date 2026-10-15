import * as schema from 'schemawax';

export type Worn = 'nothing' | 'position' | 'outline' | 'z-index' | 'opacity' | 'transform' | 'isolation';

export const wornParam: schema.Decoder<Worn> =
  schema.literalUnion('nothing', 'position', 'outline', 'z-index', 'opacity', 'transform', 'isolation');
