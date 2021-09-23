import {Result} from '@ryandur/sand';
import {Explanation, HTTPError} from '../../types';
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