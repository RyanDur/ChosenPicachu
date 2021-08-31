import {failure, success} from './actions';
import {HTTPError, HTTPMethod} from './types';

export interface Request {
    url: string;
    method?: string;
}

export const http = (
    {
        url,
        method = HTTPMethod.GET
    }: Request) =>
    fetch(url, {method, mode: 'cors'}).then(async response => {
        switch (response.status) {
            case 200:
            case 201:
                return success(await response.json());
            case 204:
                return success();
            case 403:
                return failure(HTTPError.FORBIDDEN);
            default:
                return failure(HTTPError.UNKNOWN);
        }
    }).catch((e) => {
        console.log(e);
        return failure(HTTPError.THROWN);
    });