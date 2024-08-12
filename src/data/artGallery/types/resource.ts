import {matchOn} from '@ryandur/sand';

export enum Source {
    AIC = 'aic',
    HARVARD = 'harvard',
    RIJKS = 'rijksstudio'
}

export const matchSource = matchOn(Object.values(Source));

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

export type GetAllArtRequest = Omit<GetAllArt, 'source'>

export interface GetArt {
    id: string;
    source: Source;
}

export interface Query {
    path?: (string | number)[];
    params?: Record<string, unknown>
}
