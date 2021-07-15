export interface Pagination {
    total: number;
    limit: number;
    offset: number;
    total_pages: number;
    current_page: number;
    next_url: string;
}

export interface ArtWork {
    id: number,
    title: string,
    image_id: string
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

export interface ArtICResponse {
    pagination: Pagination;
    data: ArtWork[];
    info: Info;
    config: Config;
}

export interface Art {
    pagination: Pagination;
    pieces: ArtWork[];
    baseUrl: string;
}