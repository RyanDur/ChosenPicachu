export enum Source {
    AIC = 'aic',
    HARVARD = 'harvard',
    VAM = 'vam'
}

export type SearchArt = {
    search: string;
    source: Source;
}

export type GetAllArt = {
    search?: string;
    page: number;
    size?: number;
    source: Source;
}

export type GetAllArtRequest = Omit<GetAllArt, 'source'>

export type GetArt = {
    id: string;
    source: Source;
}

export type Query = {
    path?: (string | number)[];
    params?: Record<string, unknown>
}
