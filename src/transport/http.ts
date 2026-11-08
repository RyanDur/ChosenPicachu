import {asyncFailure, asyncResult, asyncSuccess, maybe, requesting, Result} from '@ryandur/sand';
import {HTTPError} from './HTTPError';

export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

const answered = (status: number) => (response: Response): boolean => response.status === status;
const isOk = answered(200);
const isCreated = answered(201);
const isNoContent = answered(204);

const refusals: Record<number, HTTPError> = {
  401: HTTPError.FORBIDDEN,
  403: HTTPError.FORBIDDEN,
  404: HTTPError.NOT_FOUND,
  500: HTTPError.SERVER_ERROR
};

export const http = {
  get: <T>(endpoint: string, {cache}: {cache?: RequestCache} = {}): Result.Async<T, HTTPError> =>
    request(endpoint, 'GET', {cache}).mBind(response =>
      maybe(response, isOk).map(bodyResult)
        .orElse(fail(response))),

  post: <T>(
    endpoint: string,
    body: unknown,
    {headers}: {headers?: Record<string, string>} = {}
  ): Result.Async<T, HTTPError> =>
    request(endpoint, 'POST', {body, headers}).mBind(response =>
      maybe(response, isOk).or(() => maybe(response, isCreated)).map(bodyResult)
        .orElse(fail(response))),

  put: <T>(endpoint: string, body: unknown): Result.Async<T | undefined, HTTPError> =>
    request(endpoint, 'PUT', {body}).mBind(response =>
      maybe(response, isNoContent).map(emptySuccess)
        .or(() => maybe(response, isCreated).map(bodyResult))
        .orElse(fail(response))),

  delete: (endpoint: string): Result.Async<undefined, HTTPError> =>
    request(endpoint, 'DELETE').mBind(response =>
      maybe(response, isNoContent).map(emptySuccess)
        .orElse(fail(response)))
};

const bodyResult = (resp: Response) => asyncResult(resp.json()).or(() => asyncFailure(HTTPError.JSON_BODY_ERROR));
const emptySuccess = () => asyncSuccess<undefined, HTTPError>(undefined);

type RequestOptions = {body?: unknown; cache?: RequestCache; headers?: Record<string, string>};

const request = (uri: string, method: HTTPMethod, {body, cache, headers}: RequestOptions = {}) =>
  requesting(uri, {method, mode: 'cors', body, cache, headers}, () => HTTPError.NETWORK_ERROR);

const fail = (response: Response) => asyncFailure(maybe(refusals[response.status]).orElse(HTTPError.UNKNOWN));
