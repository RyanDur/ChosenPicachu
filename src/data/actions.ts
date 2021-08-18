import {Art, ArtSuggestion, AsyncState, Error, Loaded, Loading, Piece} from './types';

export type GetPieceAction = Loading | Loaded<Piece> | Error;
export type GetArtAction = Loading | Loaded<Art> | Error;
export type SearchArtAction = Loaded<ArtSuggestion[]>

export const loading = (): Loading => ({type: AsyncState.LOADING});
export const success = <T>(value: T): Loaded<T> => ({type: AsyncState.SUCCESS, value});
export const error = (): Error => ({type: AsyncState.ERROR});
