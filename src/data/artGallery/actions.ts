import {AppError, AsyncState, Error, Loaded, Loading} from '../types';
import {AllArt, Art, SearchOptions} from './types';

export enum ArtRequestError {
    CANNOT_DESERIALIZE = 'CANNOT_DESERIALIZE',
    UNKNOWN_SOURCE = 'UNKNOWN_SOURCE'
}

export type GetArtAction = Loading | Loaded<Art> | Error<AppError>;
export type GetAllArtAction = Loading | Loaded<AllArt> | Error<AppError>;
export type SearchArtAction = Loading | Loaded<SearchOptions> | Error<AppError>;

export const loading = (): Loading => ({type: AsyncState.LOADING});
export const loaded = <T>(value: T): Loaded<T> => ({type: AsyncState.LOADED, value});
export const error = (reason?: AppError): Error<AppError> => ({type: AsyncState.ERROR, reason});
