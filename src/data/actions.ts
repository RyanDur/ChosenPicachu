import {Art, ArtSuggestion, AsyncState, AutoCompleteResponse, Error, Loaded, Loading, Piece} from './types';

export type GetPieceAction = Loading | Loaded<Piece> | Error;
export type GetArtAction = Loading | Loaded<Art> | Error;
export type SearchArtAction = Loading | Loaded<ArtSuggestion[]> | Error;
export type SearchArtResponse = Loading | Loaded<AutoCompleteResponse> | Error;

export const loading = (): Loading => ({type: AsyncState.LOADING});
export const loaded = <T>(value: T): Loaded<T> => ({type: AsyncState.LOADED, value});
export const error = (): Error => ({type: AsyncState.ERROR});
