import {Art, ArtSuggestion, AsyncState, AutoCompleteResponse, Error, Loaded, Loading, Piece, Success} from './types';

export type GetPieceAction = Loading | Loaded<Piece> | Error;
export type GetArtAction = Loading | Loaded<Art> | Error;
export type SearchArtAction = Loading | Loaded<ArtSuggestion[]> | Error;
export type SearchArtResponse = Loading | Loaded<AutoCompleteResponse> | Error;

export type HTTPAction<T> = Loading | Success<T> | Error;

export const loading = (): Loading => ({type: AsyncState.LOADING});
export const success = <T>(value: T): Loaded<T> => ({type: AsyncState.SUCCESS, value});
export const error = (): Error => ({type: AsyncState.ERROR});
