import {failure, success} from './actions';
import {HTTPError, HTTPMethod} from './types';
import {Decoder} from 'schemawax';

export interface Request {
    url: string;
    decoder?: Decoder<any>;
    method?: string;
}

export const http = (
    {
        url,
        decoder,
        method = HTTPMethod.GET
    }: Request) =>
    fetch(url, {method, mode: 'cors'}).then(async response => {
        switch (response.status) {
            case 200:
            case 201: {
                const body = await response.json();
                console.log('body', body);
                console.log('validated', decoder?.validate(body));
                const decoded = decoder?.decode(body);
                return decoded ? success(decoded) : failure(HTTPError.MALFORMED_RESPONSE);
            }
            case 204:
                return success();
            case 403:
                return failure(HTTPError.FORBIDDEN);
            default:
                return failure(HTTPError.UNKNOWN);
        }
    }).catch(() => failure(HTTPError.THROWN));