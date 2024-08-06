import {FailStatusCode, HTTPError, HTTPMethod, HTTPStatus, matchFailStatusCode, PATH} from './types';
import {asyncFailure, asyncResult, asyncSuccess, maybe, Result} from '@ryandur/sand';
import {Decoder} from 'schemawax';

export const http = {
  get: <T>(endpoint: string): Result.Async<T, HTTPError> =>
    request(endpoint).mBind(response => maybe(response, response.status === HTTPStatus.OK)
      .map((resp) => asyncResult(resp.json()).or(() => asyncFailure(HTTPError.JSON_BODY_ERROR)))
      .orElse(fail(response))),

  // the rest of these are not needed. They are just here for an example
  post: <T>(endpoint: string, body: unknown): Result.Async<T, HTTPError> =>
    request(endpoint, HTTPMethod.POST, body).mBind(response => maybe(response, response.status === HTTPStatus.CREATED)
      .map((resp) => asyncResult(resp.json()).or(() => asyncFailure(HTTPError.JSON_BODY_ERROR)))
      .orElse(fail(response))),

  put: <T>(endpoint: string, body: unknown): Result.Async<T, HTTPError> =>
    request(endpoint, HTTPMethod.PUT, body).mBind(response => maybe(response, response.status === HTTPStatus.CREATED)
      .map((resp) => asyncResult(resp.json()).or(() => asyncFailure(HTTPError.JSON_BODY_ERROR)))
      .orElse(fail(response))),

  delete: (endpoint: string): Result.Async<typeof undefined, HTTPError> =>
    request(endpoint, HTTPMethod.DELETE).mBind(response => response.status === HTTPStatus.NO_CONTENT ?
      asyncSuccess(undefined) : fail(response))
};

export const validate = <T>(schema: Decoder<T>) => (response: unknown): Result.Async<T, HTTPError> =>
  maybe(schema.decode(response))
    .map(result => asyncSuccess<T, HTTPError>(result))
    .orElse(asyncFailure(HTTPError.CANNOT_DECODE));

const request = (uri: PATH, method?: HTTPMethod, body?: unknown) =>
  asyncResult(fetch(uri, {
    method,
    mode: 'cors',
    ...{body: (body ? JSON.stringify(body) : undefined)}
  })).or(() => asyncFailure(HTTPError.NETWORK_ERROR));

const fail = <T>(response: Response) => matchFailStatusCode(response.status, {
  [FailStatusCode.FORBIDDEN]: () => asyncFailure<T, HTTPError>(HTTPError.FORBIDDEN),
  [FailStatusCode.SERVER_ERROR]: () => asyncFailure<T, HTTPError>(HTTPError.SERVER_ERROR)
}).orElse(asyncFailure<T, HTTPError>(HTTPError.UNKNOWN));
