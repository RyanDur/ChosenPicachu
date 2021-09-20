import {
    Explanation,
    explanation,
    FailStatusCode,
    HTTPError,
    HTTPMethod,
    HTTPStatus,
    matchFailStatusCode,
    PATH,
    Request
} from './types';
import {asyncResult, MatchOn, maybe, Result} from '@ryandur/sand';
import {Decoder} from 'schemawax';

const {success, failure} = asyncResult;

export const validate = <T>(schema: Decoder<T>) => (response: unknown): Result.Async<T, Explanation<HTTPError>> =>
    maybe.of(schema.decode(response))
        .map(result => success<T, Explanation<HTTPError>>(result))
        .orElse(failure<T, Explanation<HTTPError>>(explanation(HTTPError.CANNOT_DECODE)));

export const http = {
    get: <T>({endpoint}: Request): Result.Async<T, Explanation<HTTPError>> =>
        request(endpoint).flatMap(response => response.status === HTTPStatus.OK ?
            asyncResult.of<T, Error>(response.json()).mapFailure<Explanation<HTTPError>>(
                err => explanation(HTTPError.JSON_BODY_ERROR, maybe.some(err))
            ) : fail(response)),

    // the rest of these are not needed. They are just here for an example
    post: <T>({endpoint, body}: Request): Result.Async<T, Explanation<HTTPError>> =>
        request(endpoint, HTTPMethod.POST, body).flatMap(response => response.status === HTTPStatus.CREATED ?
            asyncResult.of<T, Error>(response.json()).mapFailure<Explanation<HTTPError>>(
                err => explanation(HTTPError.JSON_BODY_ERROR, maybe.some(err))
            ) : fail(response)),

    put: ({endpoint, body}: Request): Result.Async<typeof undefined, Explanation<HTTPError>> =>
        request(endpoint, HTTPMethod.PUT, body).flatMap(response => response.status === HTTPStatus.NO_CONTENT ?
            success(undefined) : fail(response)),

    delete: ({endpoint}: Request): Result.Async<typeof undefined, Explanation<HTTPError>> =>
        request(endpoint, HTTPMethod.DELETE).flatMap(response => response.status === HTTPStatus.NO_CONTENT ?
            success(undefined) : fail(response))
};

const request = (uri: PATH, method?: HTTPMethod, body?: unknown) =>
    asyncResult.of<Response, Error>(fetch(uri, {
        method,
        mode: 'cors',
        ...{body: (body ? JSON.stringify(body) : undefined)}
    })).mapFailure(err => explanation(HTTPError.NETWORK_ERROR, maybe.some(err)));

const fail = <T>(response: Response) => matchFailStatusCode(response.status, {
    [FailStatusCode.FORBIDDEN]: () => failure<T, Explanation<HTTPError>>(explanation(HTTPError.FORBIDDEN)),
    [FailStatusCode.SERVER_ERROR]: () => failure<T, Explanation<HTTPError>>(explanation(HTTPError.SERVER_ERROR)),
    [MatchOn.DEFAULT]: () => failure<T, Explanation<HTTPError>>(explanation(HTTPError.UNKNOWN))
});
