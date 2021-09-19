import {FailStatusCode, HTTPError, HTTPMethod, HTTPStatus, toFailStatusCode, URI} from './types';
import {asyncResult, maybe, Result} from '@ryandur/sand';
import {Decoder} from 'schemawax';

const {success, failure} = asyncResult;

export const validate = <T>(schema: Decoder<T>) => (result: unknown): Result.Async<T, HTTPError> =>
    maybe.of(schema.decode(result))
        .map(response => success<T, HTTPError>(response))
        .orElse(failure<T, HTTPError>(HTTPError.CANNOT_DECODE));

export const http = {
    get: <T>(uri: URI): Result.Async<T, HTTPError> =>
        request(uri).flatMap((response: Response) =>
            response.status === HTTPStatus.OK ? asyncResult.of(response.json()) : fail(response)),

    // the rest of these are not needed. They are just here for an example
    post: <T>(uri: URI, body: unknown): Result.Async<T, HTTPError> =>
        request(uri, HTTPMethod.POST, body).flatMap((response: Response) =>
            response.status === HTTPStatus.CREATED ? asyncResult.of(response.json()) : fail(response)),

    put: (uri: URI, body: unknown): Result.Async<typeof undefined, HTTPError> =>
        request(uri, HTTPMethod.PUT, body).flatMap((response: Response) =>
            response.status === HTTPStatus.NO_CONTENT ? success(undefined) : fail(response)),

    delete: (uri: URI): Result.Async<typeof undefined, HTTPError> =>
        request(uri, HTTPMethod.DELETE).flatMap((response: Response) =>
            response.status === HTTPStatus.NO_CONTENT ? success(undefined) : fail(response))
};

const request = (uri: URI, method?: HTTPMethod, body?: unknown) =>
    asyncResult.of(fetch(uri, {
        method,
        mode: 'cors',
        ...{body: (body ? JSON.stringify(body) : undefined)}
    })).mapFailure(() => HTTPError.NETWORK_ERROR);

const fail = <T>(response: Response): Result.Async<T, HTTPError> => ({
    [FailStatusCode.FORBIDDEN]: () => failure<T, HTTPError>(HTTPError.FORBIDDEN),
    [FailStatusCode.SERVER_ERROR]: () => failure<T, HTTPError>(HTTPError.SERVER_ERROR),
    [FailStatusCode.UNKNOWN]: () => failure<T, HTTPError>(HTTPError.UNKNOWN)
})[toFailStatusCode(response.status)]();
