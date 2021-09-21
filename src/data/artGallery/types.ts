import {matches, matchOn, Result} from '@ryandur/sand';
import {Explanation, HTTPError} from '../types';
import {AICAllArt, AICPieceData, AICSearch} from './aic/types';
import {HarvardAllArt, HarvardArt, HarvardSearch} from './harvard/types';
import {RIJKSAllArt, RIJKSArt} from './rijks/types';

export enum Source {
    AIC = 'aic',
    HARVARD = 'harvard',
    RIJKS = 'rijksstudio'
}

export const matchSource = matchOn(matches(Object.values(Source)));

export type Pagination = {
    total: number;
    limit: number;
    totalPages: number;
    currentPage: number;
}

export type Art = {
    id: string;
    title: string;
    image?: string | null;
    altText: string;
    artistInfo: string;
}

export interface AllArt {
    pagination: Pagination;
    pieces: Art[];
}

export type SearchOptions = string[];

export interface SearchArt {
    search: string;
    source: Source;
}

export interface GetAllArt {
    search?: string;
    page: number;
    size: number;
    source: Source;
}

export interface GetArt {
    id: string;
    source: Source;
}

export type Gallery = AllArt | Art | SearchOptions;

export interface Query {
    path?: (string | number)[];
    params?: Record<string, unknown>
}

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