import {Art, AsyncState, Error, Loaded, Loading, Piece} from './types';

export type GetPieceAction = Loading | Loaded<Piece> | Error;
export type GetArtAction = Loading | Loaded<Art> | Error;

export const loading = (): Loading => ({type: AsyncState.LOADING});
export const onSuccess = <T>(value: T): Loaded<T> => ({type: AsyncState.SUCCESS, value});
export const onError = (): Error => ({type: AsyncState.ERROR});
