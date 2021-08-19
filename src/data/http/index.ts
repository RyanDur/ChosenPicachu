import {domain} from '../../config';
import {toQueryString} from '../../util/URL';
import {Consumer} from '../../components/UserInfo/types';
import {failure, HTTPAction, success} from './actions';
import {HTTPError, HTTPMethod} from './types';

const toUrl = (path: string, queryParams?: Record<string, unknown>) =>
    `${domain}${path}${toQueryString(queryParams)}`;

export interface Request {
    path: string;
    method?: string;
    queryParams?: Record<string, unknown>
}

export const http = <T>({path, method = HTTPMethod.GET, queryParams}: Request, onComplete: Consumer<HTTPAction<T>>): void =>
    void fetch(toUrl(path, queryParams), {method}).then(async response => {
        switch (response.status) {
            case 200:
            case 201:
                return onComplete(success(await response.json()));
            case 204:
                return onComplete(success());
            case 403:
                return onComplete(failure(HTTPError.FORBIDDEN));
            default:
                return onComplete(failure(HTTPError.UNKNOWN));
        }
    });