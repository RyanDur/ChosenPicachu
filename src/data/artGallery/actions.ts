import {AsyncState, Error, Loaded, Loading} from '../types';
import {AllArt, SearchOptions, Art} from './types';

export type GetArtAction = Loading | Loaded<Art> | Error;
export type GetAllArtAction = Loading | Loaded<AllArt> | Error;
export type SearchArtAction = Loading | Loaded<SearchOptions> | Error;

export const loading = (): Loading => ({type: AsyncState.LOADING});
export const loaded = <T>(value: T): Loaded<T> => ({type: AsyncState.LOADED, value});
export const error = (): Error => ({type: AsyncState.ERROR});
