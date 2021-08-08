import {AsyncState, Loaded, Loading} from './types';

export const loading = (): Loading => ({type: AsyncState.LOADING});
export const onSuccess = <T>(value: T): Loaded<T> => ({type: AsyncState.LOADED, value});