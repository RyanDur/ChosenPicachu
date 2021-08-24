import {Consumer} from '../../components/UserInfo/types';

import {
    AICArtOption,
    AICArtResponse,
    AICAutocomplete,
    AICAutoCompleteResponse,
    AICPieceData,
    AICPieceResponse,
    AICArtSuggestion
} from './AIC';
import {
    HarvardArtResponse, HarvardArtSuggestion, HarvardAutoCompleteResponse,
    InfoResponse,
    PeopleResponse,
    RecordResponse
} from './Harvard';

export type ArtResponse = AICArtResponse & HarvardArtResponse
export type PieceResponse = AICPieceData & AICPieceResponse & RecordResponse

export type {
    AICArtOption,
    AICArtResponse,
    AICAutocomplete,
    AICAutoCompleteResponse,
    AICPieceData,
    AICPieceResponse,
    AICArtSuggestion,

    HarvardArtResponse,
    InfoResponse,
    PeopleResponse,
    RecordResponse
};

export type Pagination = {
    total: number;
    limit: number;
    offset: number;
    totalPages: number;
    currentPage: number;
    nextUrl: string;
}

export type Piece = {
    id: number;
    title: string;
    image?: string;
    altText: string;
    artistInfo: string;
}

export interface Art {
    pagination: Pagination;
    pieces: Piece[];
}

export type ArtSuggestion = AICArtSuggestion | HarvardArtSuggestion;
export type AutocompleteResponse = AICAutoCompleteResponse & HarvardAutoCompleteResponse
export enum AsyncState {
    LOADING = 'LOADING',
    LOADED = 'LOADED',
    ERROR = 'ERROR'
}

export interface Action<T> {
    type: T;
}

export interface ArtQuery {
    search?: string;
    page: number;
    source: Source;
}

export enum Source {
    AIC = 'aic',
    HARVARD = 'harvard',
}

export const toSource = (value: string): Source => {
    if (value === Source.AIC.valueOf()) return Source.AIC;
    else return Source.HARVARD;
};

export type Dispatch<T> = Consumer<T>;

export type Loaded<T> = Action<AsyncState.LOADED> & {
    value: T;
};
export type Loading = Action<AsyncState.LOADING>;

export type Error = Action<AsyncState.ERROR>;
