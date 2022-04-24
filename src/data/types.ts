import {matchOn, maybe, Maybe} from '@ryandur/sand';

export type PATH = string;

export type Explanation<T, E = any> = {
    reason: T,
    err: Maybe<E>
}

export const explanation = <T, E = Error>(reason: T, err: Maybe<E> = maybe.nothing<E>()): Explanation<T, E> =>
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

export enum SuccessStatusCode {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
}

export enum FailStatusCode {
    FORBIDDEN = 403,
    SERVER_ERROR = 500,
}

export enum HTTPStatus {
    OK = SuccessStatusCode.OK,
    CREATED = SuccessStatusCode.CREATED,
    NO_CONTENT = SuccessStatusCode.NO_CONTENT,
    FORBIDDEN = FailStatusCode.FORBIDDEN,
    SERVER_ERROR = FailStatusCode.SERVER_ERROR
}

export const matchFailStatusCode = matchOn(Object.values(FailStatusCode));