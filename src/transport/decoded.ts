import {Decoder} from 'schemawax';
import {asyncFailure, asyncSuccess, maybe, Result} from '@ryandur/sand';
import {HTTPError} from './HTTPError';

type Decoded = {
  by: <T>(schema: Decoder<T>) => (response: unknown) => Result.Async<T, HTTPError>;
};

export const decoded: Decoded = {
  by: schema => response =>
    maybe(schema.decode(response))
      .map(result => asyncSuccess(result))
      .orElse(asyncFailure(HTTPError.CANNOT_DECODE))
};
