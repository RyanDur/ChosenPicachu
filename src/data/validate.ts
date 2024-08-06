import {Decoder} from 'schemawax';
import {asyncFailure, asyncSuccess, maybe, Result} from '@ryandur/sand';
import {HTTPError} from './types.ts';

export const validate = <T>(schema: Decoder<T>) => (response: unknown): Result.Async<T, HTTPError> =>
  maybe(schema.decode(response))
    .map(result => asyncSuccess<T, HTTPError>(result))
    .orElse(asyncFailure(HTTPError.CANNOT_DECODE));
