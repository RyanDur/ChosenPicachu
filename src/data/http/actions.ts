import {Action} from '../types';
import {HTTPError, HTTPStatus} from './types';

export type Loading = Action<HTTPStatus.LOADING>;
export type Success<T> = Action<HTTPStatus.SUCCESS> & { value: T; };
export type Error = Action<HTTPStatus.FAILURE> & { reason: HTTPError };

export type HTTPAction<T> = Loading | Success<T> | Error;

export const loading = (): Loading => ({type: HTTPStatus.LOADING});
export const success = <T>(value: T = {} as T): Success<T> => ({type: HTTPStatus.SUCCESS, value});
export const failure = (reason: HTTPError): Error => ({type: HTTPStatus.FAILURE, reason});
