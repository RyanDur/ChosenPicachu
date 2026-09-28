import * as schema from 'schemawax';

export type FoldType = 'inclusive' | 'exclusive';

export type FoldInput = 'checkbox' | 'radio';

export const foldTypeParam: schema.Decoder<FoldType> = schema.literalUnion('inclusive', 'exclusive');
