import {HTTPError, HTTPMethod} from './types';
import {asyncResult} from '@ryandur/sand';

const {success, failure} = asyncResult;
export interface Request {
    url: string;
    method?: string;
}

export const http = ({
    url,
    method = HTTPMethod.GET
}: Request) =>
    asyncResult.of<any, HTTPError>(fetch(url, {method, mode: 'cors'}))
        .mapFailure(() => HTTPError.SERVER_ERROR)
        .flatMap((response: Response) => {
            switch (response.status) {
                case 200:
                case 201:
                    return asyncResult.of(response.json());
                case 204:
                    return success<any, HTTPError>(undefined);
                case 403:
                    return failure<any, HTTPError>(HTTPError.FORBIDDEN);
                default:
                    return failure<any, HTTPError>(HTTPError.UNKNOWN);
            }
        });
