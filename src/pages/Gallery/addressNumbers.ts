import * as schema from 'schemawax';
import {numberParam} from '@navigation/search-params';

const offeredFrom = (least: number, most: number): schema.Decoder<number> => numberParam.andThen(number => {
  if (number < least || number > most) throw new schema.DecoderError(`The gallery offers ${least} to ${most}, not ${number}`);
  return number;
});

export const addressNumbers = {page: offeredFrom(1, Infinity), size: offeredFrom(1, 100)};
