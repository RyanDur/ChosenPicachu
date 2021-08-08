import {Consumer} from '../../components/UserInfo/types';

export interface PaginationResponse {
    total: number;
    limit: number;
    offset: number;
    total_pages: number;
    current_page: number;
    next_url: string;
}

export type Pagination =  {
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

export type PieceResponse = {
    data: {
        id: number;
        title: string;
        image_id: string;
        term_titles: string[];
        artist_display: string;
        thumbnail?: Thumbnail;
    }
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

export interface StateChange<T> {
    onSuccess: Consumer<T>;
    onLoading: Consumer<boolean>;
}

export enum AsyncState {
    LOADING = 'LOADING',
    SUCCESS = 'SUCCESS'
}

export interface State<T> {
    type: T;
}

export type Loading = State<AsyncState.LOADING>;
export type Loaded<T> = State<AsyncState.SUCCESS> & {
    value: T;
};
