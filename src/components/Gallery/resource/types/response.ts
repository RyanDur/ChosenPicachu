import {AICAllArtResponse, AICArtResponse} from '../aic/types';
import {HarvardAllArtResponse, HarvardArtResponse} from '../harvard/types';
import {RIJKSAllArtResponse, RIJKSArtResponse} from '../rijks/types';

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
export type AllArtResponse = AICAllArtResponse | HarvardAllArtResponse | RIJKSAllArtResponse;
export type ArtResponse = AICArtResponse | HarvardArtResponse | RIJKSArtResponse;
