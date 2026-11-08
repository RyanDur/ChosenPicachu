import * as schema from 'schemawax';

export const numberParam: schema.Decoder<number> = schema.regex(/^-?\d+$/).andThen(Number);
