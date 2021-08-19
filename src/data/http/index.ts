import {domain} from '../../config';
import {toQueryString} from '../../util/URL';
import {failure, success} from './actions';
import {HTTPError, HTTPMethod} from './types';

const toUrl = (path: string, queryParams?: Record<string, unknown>) =>
    `${domain}${path}${toQueryString(queryParams)}`;

export interface Request {
    path: string;
    method?: string;
    queryParams?: Record<string, unknown>
}

export const http = (
    {
        path,
        method = HTTPMethod.GET,
        queryParams
    }: Request) =>
    fetch(toUrl(path, queryParams), {method}).then(async response => {
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
    });