import {FailStatusCode, HTTPError, HTTPMethod, isCreated, isNoContent, isOk, matchFailStatusCode, PATH} from './types';
import {asyncFailure, asyncResult, asyncSuccess, maybe, requesting, Result} from '@ryandur/sand';

export const http = {
  get: <T>(endpoint: string, {cache}: {cache?: RequestCache} = {}): Result.Async<T, HTTPError> =>
    request(endpoint, HTTPMethod.GET, {cache}).mBind(response =>
      maybe(response, isOk).map(bodyResult)
        .orElse(fail(response))),

  post: <T>(endpoint: string, body: unknown, {headers}: {headers?: Record<string, string>} = {}): Result.Async<T, HTTPError> =>
    request(endpoint, HTTPMethod.POST, {body, headers}).mBind(response =>
      maybe(response, isOk).or(() => maybe(response, isCreated)).map(bodyResult)
        .orElse(fail(response))),

  put: <T>(endpoint: string, body: unknown): Result.Async<T | undefined, HTTPError> =>
    request(endpoint, HTTPMethod.PUT, {body}).mBind(response =>
      maybe(response, isNoContent).map(emptySuccess)
        .or(() => maybe(response, isCreated).map(bodyResult))
        .orElse(fail(response))),

  delete: (endpoint: string): Result.Async<undefined, HTTPError> =>
    request(endpoint, HTTPMethod.DELETE).mBind(response =>
      maybe(response, isNoContent).map(emptySuccess)
        .orElse(fail(response)))
};

const bodyResult = (resp: Response) => asyncResult(resp.json()).or(() => asyncFailure(HTTPError.JSON_BODY_ERROR));
const emptySuccess = () => asyncSuccess<undefined, HTTPError>(undefined);

type RequestOptions = {body?: unknown; cache?: RequestCache; headers?: Record<string, string>};

const request = (uri: PATH, method: HTTPMethod, {body, cache, headers}: RequestOptions = {}) =>
  requesting(uri, {method, mode: 'cors', body, cache, headers}, () => HTTPError.NETWORK_ERROR);

const fail = (response: Response) => matchFailStatusCode(response.status, {
  [FailStatusCode.UNAUTHORIZED]: () => asyncFailure(HTTPError.FORBIDDEN),
  [FailStatusCode.FORBIDDEN]: () => asyncFailure(HTTPError.FORBIDDEN),
  [FailStatusCode.NOT_FOUND]: () => asyncFailure(HTTPError.NOT_FOUND),
  [FailStatusCode.SERVER_ERROR]: () => asyncFailure(HTTPError.SERVER_ERROR)
}).orElse(asyncFailure(HTTPError.UNKNOWN));
