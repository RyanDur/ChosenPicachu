import {Art, AsyncState, Loaded, Loading, Piece} from './types';

export type GetPieceAction = Loading | Loaded<Piece>;
export type GetArtAction = Loading | Loaded<Art>;

export const loading = (): Loading => ({type: AsyncState.LOADING});
export const onSuccess = <T>(value: T): Loaded<T> => ({type: AsyncState.SUCCESS, value});