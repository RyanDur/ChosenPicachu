import {
    Explanation,
    explanation,
    FailStatusCode,
    HTTPError,
    HTTPMethod,
    HTTPStatus,
    matchFailStatusCode,
    PATH,
} from './types';
import {asyncResult, maybe, Result} from '@ryandur/sand';
import {Decoder} from 'schemawax';

const {success, failure} = asyncResult;

export const http = {
    get: <T>(endpoint: string): Result.Async<T, Explanation<HTTPError>> =>
        request(endpoint).mBind(handleBody(HTTPStatus.OK)),

    // the rest of these are not needed. They are just here for an example
    post: <T>(endpoint: string, body: unknown): Result.Async<T, Explanation<HTTPError>> =>
        request(endpoint, HTTPMethod.POST, body).mBind(handleBody(HTTPStatus.CREATED)),

    put: (endpoint: string, body: unknown): Result.Async<typeof undefined, Explanation<HTTPError>> =>
        request(endpoint, HTTPMethod.PUT, body).mBind(handleNoContent),

    delete: (endpoint: string): Result.Async<typeof undefined, Explanation<HTTPError>> =>
        request(endpoint, HTTPMethod.DELETE).mBind(handleNoContent)
};

export const unknownSource = <T>() => asyncResult.failure<T, Explanation<HTTPError>>(explanation(HTTPError.UNKNOWN_SOURCE));

export const validate = <T>(schema: Decoder<T>) => (response: unknown): Result.Async<T, Explanation<HTTPError>> =>
    maybe.of(schema.decode(response))
        .map(result => success<T, Explanation<HTTPError>>(result))
        .orElse(failure<T, Explanation<HTTPError>>(explanation(HTTPError.CANNOT_DECODE)));

const unwrap = <T>(response: Response) => asyncResult.of(response.json())
    .or(err => failure<T, Explanation<HTTPError>>(explanation(
        HTTPError.JSON_BODY_ERROR,
        maybe.some(err)
    )));

const handleBody = <T>(status: HTTPStatus) => (response: Response): Result.Async<T, Explanation<HTTPError>> =>
    response.status === status ? unwrap(response) : failure(explain(response));

const handleNoContent = (response: Response): Result.Async<typeof undefined, Explanation<HTTPError>> =>
    response.status === HTTPStatus.NO_CONTENT ? success(undefined) : failure(explain(response));

const request = (uri: PATH, method?: HTTPMethod, body?: unknown) =>
    asyncResult.of<Response, Error>(fetch(uri, {
        method,
        mode: 'cors',
        ...{body: (body ? JSON.stringify(body) : undefined)}
    })).or(err => asyncResult.failure(explanation(HTTPError.NETWORK_ERROR, maybe.some(err))));

const explain = (response: Response): Explanation<HTTPError> => matchFailStatusCode(response.status, {
    [FailStatusCode.FORBIDDEN]: () => explanation(HTTPError.FORBIDDEN, maybe.some(response)),
    [FailStatusCode.SERVER_ERROR]: () => explanation(HTTPError.SERVER_ERROR, maybe.some(response)),
}).orElse(explanation(HTTPError.UNKNOWN));
