import {matchOn} from '../util';
import {maybe, Maybe} from '@ryandur/sand';

export type PATH = string;

export interface Indexable {
    readonly [x: string]: string | undefined;
}

export type Explanation<E> = {
    reason: E,
    err: Maybe<Error>
}

export const explanation = <T>(reason: T, err: Maybe<Error> = maybe.nothing()): Explanation<T> =>
    ({reason, err});

export enum HTTPMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE'
}

export enum HTTPError {
    FORBIDDEN = 'FORBIDDEN',
    UNKNOWN = 'UNKNOWN',
    SERVER_ERROR = 'SERVER_ERROR',
    CANNOT_DECODE = 'CANNOT_DECODE',
    UNKNOWN_SOURCE = 'UNKNOWN_SOURCE',
    NETWORK_ERROR = 'NETWORK_ERROR',
    JSON_BODY_ERROR = 'JSON_BODY_ERROR'
}

export enum HTTPStatus {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    FORBIDDEN = 403,
    SERVER_ERROR = 500,
    UNKNOWN = 0
}

export enum FailStatusCode {
    FORBIDDEN = HTTPStatus.FORBIDDEN,
    SERVER_ERROR = HTTPStatus.SERVER_ERROR,
    UNKNOWN = HTTPStatus.UNKNOWN
}

export const matchFailStatusCode = matchOn((code: number): FailStatusCode => ({
    [FailStatusCode.FORBIDDEN]: FailStatusCode.FORBIDDEN,
    [FailStatusCode.SERVER_ERROR]: FailStatusCode.SERVER_ERROR,
    [FailStatusCode.UNKNOWN]: FailStatusCode.UNKNOWN
})[code] || FailStatusCode.UNKNOWN);