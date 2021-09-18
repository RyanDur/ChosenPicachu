import {HTTPError, HTTPMethod} from './types';
import {asyncResult, maybe, Result} from '@ryandur/sand';
import {Decoder} from 'schemawax';

const {success, failure} = asyncResult;

export interface Request<T> {
    url: string;
    schema?: Decoder<T>
    method?: string;
}

export const http = <T>({
    url,
    schema,
    method = HTTPMethod.GET
}: Request<T>) => asyncResult.of(fetch(url, {method, mode: 'cors'}))
    .mapFailure(() => HTTPError.SERVER_ERROR)
    .flatMap((response: Response): Result.Async<T, HTTPError> => {
        switch (response.status) {
            case 200:
            case 201:
                return asyncResult.of<T, HTTPError>(response.json())
                    .flatMap((response: T) => maybe.of(schema?.decode(response))
                        .map(f => success<T, HTTPError>(f))
                        .orElse(failure<T, HTTPError>(HTTPError.CANNOT_DECODE)));
            case 204:
                return success<T, HTTPError>(undefined as unknown as T);
            case 403:
                return failure<T, HTTPError>(HTTPError.FORBIDDEN);
            default:
                return failure<T, HTTPError>(HTTPError.UNKNOWN);
        }
    });
