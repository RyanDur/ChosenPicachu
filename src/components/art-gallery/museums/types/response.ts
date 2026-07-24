import {AICAllArtResponse, AICArtResponse} from '@components/art-gallery/museums/aic/types';
import {HarvardAllArtResponse, HarvardArtResponse} from '@components/art-gallery/museums/harvard/types';

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
    srcSet?: string | null;
    altText: string;
    artistInfo: string;
}

export type AllArt = {
    pagination: Pagination;
    pieces: Art[];
}

export type SearchOptions = string[];
export type AllArtResponse = AICAllArtResponse | HarvardAllArtResponse;
export type ArtResponse = AICArtResponse | HarvardArtResponse;
