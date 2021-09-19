import {Consumer} from '@ryandur/sand';

export type PATH = string;

export interface Indexable {
    readonly [x: string]: string | undefined;
}
export interface Action<T> {
    type: T;
}

export type Dispatch<T> = Consumer<T>;

export enum AsyncState {
    LOADING = 'LOADING',
    LOADED = 'LOADED',
    ERROR = 'ERROR'
}

export type Loading = Action<AsyncState.LOADING>;

export type Error<E> = Action<AsyncState.ERROR> & {
    reason?: E;
};

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
    NETWORK_ERROR = 'NETWORK_ERROR'
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

export const toFailStatusCode = (code: number): FailStatusCode => ({
    [FailStatusCode.FORBIDDEN]: FailStatusCode.FORBIDDEN,
    [FailStatusCode.SERVER_ERROR]: FailStatusCode.SERVER_ERROR,
    [FailStatusCode.UNKNOWN]: FailStatusCode.UNKNOWN
})[code] || FailStatusCode.UNKNOWN;
