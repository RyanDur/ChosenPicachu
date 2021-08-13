export interface PaginationResponse {
    total: number;
    limit: number;
    offset: number;
    total_pages: number;
    current_page: number;
    next_url: string;
}

export type Pagination = {
    total: number;
    limit: number;
    offset: number;
    totalPages: number;
    currentPage: number;
    nextUrl: string;
}

export interface ArtWorkResponse {
    id: number;
    title: string;
    image_id: string;
    artist_display: string;
    term_titles: string[];
}

export type Piece = {
    id: number;
    title: string;
    imageId: string;
    altText: string;
    artistInfo: string;
}

export type Thumbnail = {
    alt_text: string;
}

export interface PieceData {
    id: number;
    title: string;
    image_id: string;
    term_titles: string[];
    artist_display: string;
    thumbnail?: Thumbnail;
}

export type PieceResponse = {
    data: PieceData;
}

export interface Info {
    license_text: string,
    license_links: string[],
    version: string
}

export interface Config {
    iiif_url: string;
    website_url: string;
}

export interface ArtResponse {
    pagination: PaginationResponse;
    data: ArtWorkResponse[];
    info: Info;
    config: Config;
}

export interface Art {
    pagination: Pagination;
    pieces: Piece[];
    baseUrl: string;
}

export type ArtSuggestion = string;

export interface ArtOption {
    input: ArtSuggestion[];
}

type Tuple<A, B> = [A, B]

export interface Autocomplete {
    suggest_autocomplete_all: Tuple<unknown, ArtOption>
}

export interface AutoCompleteResponse {
    pagination: PaginationResponse;
    data: Autocomplete[]
}

export enum AsyncState {
    LOADING = 'LOADING',
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR'
}

export interface Action<T> {
    type: T;
}

export type Loading = Action<AsyncState.LOADING>;
export type Loaded<T> = Action<AsyncState.SUCCESS> & {
    value: T;
};
export type Error = Action<AsyncState.ERROR>;
