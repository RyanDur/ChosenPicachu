import {
    FailStatusCode,
    HTTPError,
    HTTPMethod,
    HTTPStatus,
    toFailStatusCode,
    PATH,
    Explanation,
    explanation
} from './types';
import {asyncResult, maybe, Result} from '@ryandur/sand';
import {Decoder} from 'schemawax';

const {success, failure} = asyncResult;

export const validate = <T>(schema: Decoder<T>) => (result: unknown): Result.Async<T, Explanation<HTTPError>> =>
    maybe.of(schema.decode(result))
        .map(response => success<T, Explanation<HTTPError>>(response))
        .orElse(failure<T, Explanation<HTTPError>>(explanation(HTTPError.CANNOT_DECODE)));

export const http = {
    get: <T>(path: PATH): Result.Async<T, Explanation<HTTPError>> =>
        request(path).flatMap((response: Response) =>
            response.status === HTTPStatus.OK ? asyncResult.of(response.json()) : fail(response)),

    // the rest of these are not needed. They are just here for an example
    post: <T>(path: PATH, body: unknown): Result.Async<T, Explanation<HTTPError>> =>
        request(path, HTTPMethod.POST, body).flatMap((response: Response) =>
            response.status === HTTPStatus.CREATED ? asyncResult.of(response.json()) : fail(response)),

    put: (path: PATH, body: unknown): Result.Async<typeof undefined, Explanation<HTTPError>> =>
        request(path, HTTPMethod.PUT, body).flatMap((response: Response) =>
            response.status === HTTPStatus.NO_CONTENT ? success(undefined) : fail(response)),

    delete: (path: PATH): Result.Async<typeof undefined, Explanation<HTTPError>> =>
        request(path, HTTPMethod.DELETE).flatMap((response: Response) =>
            response.status === HTTPStatus.NO_CONTENT ? success(undefined) : fail(response))
};

const request = (uri: PATH, method?: HTTPMethod, body?: unknown) =>
    asyncResult.of(fetch(uri, {
        method,
        mode: 'cors',
        ...{body: (body ? JSON.stringify(body) : undefined)}
    })).mapFailure(err => explanation(HTTPError.NETWORK_ERROR, [err as Error]));

const fail = <T>(response: Response): Result.Async<T, Explanation<HTTPError>> => ({
    [FailStatusCode.FORBIDDEN]: () => failure<T, Explanation<HTTPError>>(explanation(HTTPError.FORBIDDEN)),
    [FailStatusCode.SERVER_ERROR]: () => failure<T, Explanation<HTTPError>>(explanation(HTTPError.SERVER_ERROR)),
    [FailStatusCode.UNKNOWN]: () => failure<T, Explanation<HTTPError>>(explanation(HTTPError.UNKNOWN))
})[toFailStatusCode(response.status)]();
