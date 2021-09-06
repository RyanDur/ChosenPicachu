import {AICAllArt, AICArt, AICSearchResponse} from './aic/types';
import {HarvardAllArt, HarvardArt, HarvardSearchResponse} from './harvard/types';
import {RIJKAllArt, RIJKArt} from './rijks/types';

export enum Source {
    AIC = 'aic',
    HARVARD = 'harvard',
    RIJK = 'rijksstudio',
}

export const toSource = (value: string): Source => {
    if (value === Source.AIC) return Source.AIC;
    if (value === Source.HARVARD) return Source.HARVARD;
    else return Source.RIJK;
};

export type Pagination = {
    total: number;
    limit: number;
    totalPages: number;
    currentPage: number;
}

export type Piece = {
    id: string;
    title: string;
    image?: string | null;
    altText: string;
    artistInfo: string;
}

export interface Art {
    pagination: Pagination;
    pieces: Piece[];
}

export type SearchOptions = string[];

export type AllArtResponse = AICAllArt | HarvardAllArt | RIJKAllArt;
export type ArtResponse = AICArt | HarvardArt | RIJKArt;
export type SearchResponse = AICSearchResponse | HarvardSearchResponse | RIJKAllArt;
export type Gallery = Pagination | Art | Piece | SearchOptions;