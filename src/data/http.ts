import {HTTPError, HTTPMethod, URI} from './types';
import {asyncResult, maybe, Result} from '@ryandur/sand';
import {Decoder} from 'schemawax';

const {success, failure} = asyncResult;

export const validate = <T>(schema: Decoder<T>, result: any): Result.Async<T, HTTPError> =>
    maybe.of(schema.decode(result))
        .map(response => success<T, HTTPError>(response))
        .orElse(failure<T, HTTPError>(HTTPError.CANNOT_DECODE));

export const http = {
    get: <T>(uri: URI) => request(uri)
        .flatMap((response: Response): Result.Async<T, HTTPError> =>
            response.status === 200 ?
                asyncResult.of<T, HTTPError>(response.json()) :
                failResponse<T>(response)),

    // the rest of these are not needed. They are just here for an example
    post: <T>(uri: URI, body: unknown) => request(uri, HTTPMethod.POST, body)
        .flatMap((response: Response): Result.Async<T, HTTPError> =>
            response.status === 201 ?
                asyncResult.of<T, HTTPError>(response.json()) :
                failResponse<T>(response)),

    put: (uri: URI, body: unknown) => request(uri, HTTPMethod.PUT, body)
        .flatMap((response: Response): Result.Async<unknown, HTTPError> =>
            response.status === 204 ?
                success<unknown, HTTPError>(undefined) :
                failResponse<unknown>(response)),

    delete: (uri: URI) => request(uri, HTTPMethod.DELETE)
        .flatMap((response: Response): Result.Async<unknown, HTTPError> =>
            response.status === 204 ?
                success<unknown, HTTPError>(undefined) :
                failResponse<unknown>(response))
};

const request = (uri: URI, method = HTTPMethod.GET, body?: unknown) =>
    asyncResult.of(fetch(uri, {method, mode: 'cors', ...{body: (body ? JSON.stringify(body) : undefined)}}))
        .mapFailure(() => HTTPError.SERVER_ERROR);

const failResponse = <T>(response: Response): Result.Async<T, HTTPError> => {
    switch (response.status) {
        case 403:
            return failure<T, HTTPError>(HTTPError.FORBIDDEN);
        default:
            return failure<T, HTTPError>(HTTPError.UNKNOWN);
    }
};
