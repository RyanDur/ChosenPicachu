import {matchOn} from '../../util';

export enum Source {
    AIC = 'aic',
    HARVARD = 'harvard',
    RIJKS = 'rijksstudio',
    UNKNOWN = 'UNKNOWN'
}

export const matchSource = matchOn((value: string): Source => ({
    [Source.AIC]: Source.AIC,
    [Source.HARVARD]: Source.HARVARD,
    [Source.RIJKS]: Source.RIJKS,
    [Source.UNKNOWN]: Source.UNKNOWN
})[value] || Source.UNKNOWN);

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