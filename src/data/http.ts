import {HTTPError, HTTPMethod, URI} from './types';
import {asyncResult, maybe, Result} from '@ryandur/sand';
import {Decoder} from 'schemawax';

const {success, failure} = asyncResult;

export const validate = <T>(schema: Decoder<T>) => (result: unknown): Result.Async<T, HTTPError> =>
    maybe.of(schema.decode(result))
        .map(response => success<T, HTTPError>(response))
        .orElse(failure<T, HTTPError>(HTTPError.CANNOT_DECODE));

export const http = {
    get: (uri: URI) => request(uri)
        .flatMap((response: Response) => response.status === 200 ?
            asyncResult.of(response.json()) :
            failResponse(response)),

    // the rest of these are not needed. They are just here for an example
    post: (uri: URI, body: unknown) => request(uri, HTTPMethod.POST, body)
        .flatMap((response: Response) => response.status === 201 ?
            asyncResult.of(response.json()) :
            failResponse(response)),

    put: (uri: URI, body: unknown) => request(uri, HTTPMethod.PUT, body)
        .flatMap((response: Response) => response.status === 204 ?
            success<unknown, HTTPError>(undefined) :
            failResponse(response)),

    delete: (uri: URI) => request(uri, HTTPMethod.DELETE)
        .flatMap((response: Response) => response.status === 204 ?
            success<unknown, HTTPError>(undefined) :
            failResponse(response))
};

const request = (uri: URI, method = HTTPMethod.GET, body?: unknown) =>
    asyncResult.of(fetch(uri, {method, mode: 'cors', ...{body: (body ? JSON.stringify(body) : undefined)}}))
        .mapFailure(() => HTTPError.NETWORK_ERROR);

const failResponse = <T>(response: Response): Result.Async<T, HTTPError> => {
    switch (response.status) {
        case 403:
            return failure<T, HTTPError>(HTTPError.FORBIDDEN);
        case 500:
            return failure<T, HTTPError>(HTTPError.SERVER_ERROR);
        default:
            return failure<T, HTTPError>(HTTPError.UNKNOWN);
    }
};
