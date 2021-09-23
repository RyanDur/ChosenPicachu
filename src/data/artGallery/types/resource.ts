import {matches, matchOn} from '@ryandur/sand';

export enum Source {
    AIC = 'aic',
    HARVARD = 'harvard',
    RIJKS = 'rijksstudio'
}

export const matchSource = matchOn(matches(Object.values(Source)));

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

export interface Query {
    path?: (string | number)[];
    params?: Record<string, unknown>
}
