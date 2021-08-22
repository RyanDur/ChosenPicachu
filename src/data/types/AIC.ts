type Tuple<A, B> = [A, B]

export interface AICArtResponse {
    pagination: AICPaginationResponse;
    data: AICArtWorkResponse[];
    info: AICInfo;
    config: AICConfig;
}

export type AICArtSuggestion = string;

export interface AICAutoCompleteResponse {
    pagination: AICPaginationResponse;
    data: AICAutocomplete[]
}

export interface AICArtOption {
    input: AICArtSuggestion[];
}

export interface AICAutocomplete {
    suggest_autocomplete_all: Tuple<unknown, AICArtOption>
}

export interface AICPaginationResponse {
    total: number;
    limit: number;
    offset: number;
    total_pages: number;
    current_page: number;
    next_url: string;
}

export interface AICArtWorkResponse {
    id: number;
    title: string;
    image_id: string;
    artist_display: string;
    term_titles: string[];
}

export type AICThumbnail = {
    alt_text: string;
}

export interface AICPieceResponse {
    id: number;
    title: string;
    image_id: string;
    term_titles: string[];
    artist_display: string;
    thumbnail?: AICThumbnail;
}

export type AICPieceData = {
    data: AICPieceResponse;
}

export interface AICInfo {
    license_text: string,
    license_links: string[],
    version: string
}

export interface AICConfig {
    iiif_url: string;
}