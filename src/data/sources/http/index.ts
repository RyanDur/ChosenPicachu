import {HTTPError, HTTPMethod} from './types';
import {asyncResult, result} from '@ryandur/sand';

export interface Request {
    url: string;
    method?: string;
}

export const http = ({
    url,
    method = HTTPMethod.GET
}: Request) =>
    asyncResult.of(fetch(url, {method, mode: 'cors'}).then(async response => {
        switch (response.status) {
            case 200:
            case 201:
                return result.ok(await response.json());
            case 204:
                return result.ok(null);
            case 403:
                return result.err(HTTPError.FORBIDDEN);
            default:
                return result.err(HTTPError.UNKNOWN);
        }
    }));