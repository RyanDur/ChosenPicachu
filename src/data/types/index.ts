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

export interface Thumbnail {
    alt_text: string;
}

export interface ArtWorkResponse {
    id: number;
    title: string;
    image_id: string;
    thumbnail: Thumbnail;
}

export type ArtWork = {
    id: number,
    title: string,
    imageId: string,
    altText: string;
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
    pieces: ArtWork[];
    baseUrl: string;
}