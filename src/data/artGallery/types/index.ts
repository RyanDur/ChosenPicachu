import {GetAllArt, GetArt, SearchArt} from './resource';
import {OnAsyncEvent} from '@ryandur/sand';
import {AllArt, Art, SearchOptions} from './response';
import {Explanation, HTTPError} from '../../types';

export type OnAllArtAsyncEvent = OnAsyncEvent<AllArt, Explanation<HTTPError>>;
export type OnArtAsyncEvent = OnAsyncEvent<Art, Explanation<HTTPError>>;
export type OnSearchOptionsAsyncEvent = OnAsyncEvent<SearchOptions, Explanation<HTTPError>>;

export interface ArtGallery {
    getAllArt: (request: GetAllArt) => OnAllArtAsyncEvent;
    getArt: (request: GetArt) => OnArtAsyncEvent;
    searchForArt: (request: SearchArt) => OnSearchOptionsAsyncEvent;
}