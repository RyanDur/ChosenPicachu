import {AsyncState, Error, HTTPError, Loaded, Loading} from '../types';

export const loading = (): Loading => ({type: AsyncState.LOADING});
export const loaded = <T>(value: T): Loaded<T> => ({type: AsyncState.LOADED, value});
export const error = (reason?: HTTPError): Error<HTTPError> => ({type: AsyncState.ERROR, reason});
