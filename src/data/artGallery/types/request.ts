import {Result} from '@ryandur/sand';
import {Explanation, HTTPError} from '../../types';
import {AICAllArt, AICPieceData, AICSearch} from '../aic/types';
import {HarvardAllArt, HarvardArt, HarvardSearch} from '../harvard/types';
import {RIJKSAllArt, RIJKSArt} from '../rijks/types';
import {AllArt, Art, SearchOptions} from './response';
import {Query} from './resource';


export interface AllArtRequest<T> {
    endpoint: (query: Query) => string;
    validate: (response: unknown) => Result.Async<any, Explanation<HTTPError>>,
    toAllArt: (data: T) => AllArt
}

export interface ArtRequest<T> {
    endpoint: (query: Query) => string;
    validate: (response: unknown) => Result.Async<any, Explanation<HTTPError>>,
    toArt: (data: T) => Art
}

export interface SearchOptionsRequest<T> {
    endpoint: (search: string) => string;
    validate: (response: unknown) => Result.Async<any, Explanation<HTTPError>>,
    toSearchOptions: (data: T) => SearchOptions
}

export type AllArtRequests = AllArtRequest<AICAllArt> | AllArtRequest<HarvardAllArt> | AllArtRequest<RIJKSAllArt>;
export type ArtRequests = ArtRequest<AICPieceData> | ArtRequest<HarvardArt> | ArtRequest<RIJKSArt>;
export type SearchOptionsRequests = SearchOptionsRequest<AICSearch> | SearchOptionsRequest<HarvardSearch> | SearchOptionsRequest<RIJKSAllArt>;