import {Consumer} from '@ryandur/sand';

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
    UNKNOWN_SOURCE = 'UNKNOWN_SOURCE'
}