import * as schema from 'schemawax';
import {Source} from '@pages/Gallery/museums/source';

export const sourceParam: schema.Decoder<Source> = schema.literalUnion(...Object.values(Source));
