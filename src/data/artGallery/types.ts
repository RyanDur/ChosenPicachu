import {AICAllArt, AICArt, AICSearchResponse} from './aic/types';
import {HarvardAllArt, HarvardArt, HarvardSearchResponse} from './harvard/types';
import {RIJKAllArt, RIJKArt, RIJSearchOptions} from './rijks/types';

export enum Source {
    AIC = 'aic',
    HARVARD = 'harvard',
    RIJKS = 'rijksstudio',
}

export const toSource = (value: string): Source => {
    if (value === Source.AIC) return Source.AIC;
    if (value === Source.HARVARD) return Source.HARVARD;
    else return Source.RIJKS;
};

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

export type AllArtResponse = AICAllArt | HarvardAllArt | RIJKAllArt;
export type ArtResponse = AICArt | HarvardArt | RIJKArt | undefined;
export type ArtSearchResponse = AICSearchResponse | HarvardSearchResponse | RIJSearchOptions;
export type Gallery = AllArt | Art | SearchOptions;