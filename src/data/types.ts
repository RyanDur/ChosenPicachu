export interface Indexable {
    readonly [x: string]: string | undefined;
}
export type Consumer<T> = (value: T) => void
export interface Action<T> {
    type: T;
}

export type Dispatch<T> = Consumer<T>;

export enum AsyncState {
    LOADING = 'LOADING',
    LOADED = 'LOADED',
    ERROR = 'ERROR'
}

export type Loaded<T> = Action<AsyncState.LOADED> & {
    value: T;
};
export type Loading = Action<AsyncState.LOADING>;

export type Error = Action<AsyncState.ERROR>;

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
}