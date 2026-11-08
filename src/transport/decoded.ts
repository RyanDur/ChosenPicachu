import {Decoder} from 'schemawax';
import {asyncFailure, asyncSuccess, maybe, Result} from '@ryandur/sand';
import {HTTPError} from './HTTPError';

type Decoded = {
  by: <T>(schema: Decoder<T>) => (body: unknown) => Result.Async<T, HTTPError>;
};

export const decoded: Decoded = {
  by: schema => body =>
    maybe(schema.decode(body))
      .map(decodedBody => asyncSuccess(decodedBody))
      .orElse(asyncFailure(HTTPError.CANNOT_DECODE))
};
