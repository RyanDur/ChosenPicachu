import {
  Explanation,
  explanation,
  FailStatusCode,
  HTTPError,
  HTTPMethod,
  HTTPStatus,
  matchFailStatusCode,
  PATH
} from './types';
import {asyncFailure, asyncResult, asyncSuccess, maybe, Result, some} from '@ryandur/sand';
import {Decoder} from 'schemawax';

export const unknownSource = <T>() => asyncFailure<T, Explanation<HTTPError>>(explanation(HTTPError.UNKNOWN_SOURCE));

export const validate = <T>(schema: Decoder<T>) => (response: unknown): Result.Async<T, Explanation<HTTPError>> =>
  maybe(schema.decode(response))
    .map(result => asyncSuccess<T, Explanation<HTTPError>>(result))
    .orElse(asyncFailure<T, Explanation<HTTPError>>(explanation(HTTPError.CANNOT_DECODE)));

export const http = {
  get: <T>(endpoint: string): Result.Async<T, Explanation<HTTPError>> =>
    request(endpoint).mBind(response => maybe(response, response.status === HTTPStatus.OK)
      .map(() => asyncResult<T, Error>(response.json()).or(err => asyncFailure(explanation(HTTPError.JSON_BODY_ERROR, some(err)))))
      .orElse(fail(response))),

  // the rest of these are not needed. They are just here for an example
  post: <T>(endpoint: string, body: unknown): Result.Async<T, Explanation<HTTPError>> =>
    request(endpoint, HTTPMethod.POST, body).mBind(response => response.status === HTTPStatus.CREATED
      ? asyncResult<T, Error>(response.json())
        .or(err => asyncFailure(explanation(HTTPError.JSON_BODY_ERROR, some(err))))
      : fail(response)),

  put: (endpoint: string, body: unknown): Result.Async<typeof undefined, Explanation<HTTPError>> =>
    request(endpoint, HTTPMethod.PUT, body).mBind(response => response.status === HTTPStatus.NO_CONTENT ?
      asyncSuccess(undefined) : fail(response)),

  delete: (endpoint: string): Result.Async<typeof undefined, Explanation<HTTPError>> =>
    request(endpoint, HTTPMethod.DELETE).mBind(response => response.status === HTTPStatus.NO_CONTENT ?
      asyncSuccess(undefined) : fail(response))
};

const request = (uri: PATH, method?: HTTPMethod, body?: unknown) =>
  asyncResult<Response, Error>(fetch(uri, {
    method,
    mode: 'cors',
    ...{body: (body ? JSON.stringify(body) : undefined)}
  })).or(err => asyncFailure(explanation(HTTPError.NETWORK_ERROR, some(err))));

const fail = <T>(response: Response) => matchFailStatusCode(response.status, {
  [FailStatusCode.FORBIDDEN]: () => asyncFailure<T, Explanation<HTTPError>>(explanation(HTTPError.FORBIDDEN)),
  [FailStatusCode.SERVER_ERROR]: () => asyncFailure<T, Explanation<HTTPError>>(explanation(HTTPError.SERVER_ERROR))
}).orElse(asyncFailure<T, Explanation<HTTPError>>(explanation(HTTPError.UNKNOWN)));
