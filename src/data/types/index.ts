import {Consumer} from '../../components/UserInfo/types';
import {Source, toSource} from './Source';
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
    HarvardInfoResponse,
    HarvardPeopleResponse,
    HarvardRecordResponse
} from './Harvard';
import {Loaded, Loading, Error, AsyncState} from './AsyncState';
import {RIJKAllArtResponse, RIJKAllPieceResponse} from './RIJK';

export type ArtResponse = AICArtResponse & HarvardArtResponse & RIJKAllArtResponse
export type PieceResponse = AICPieceData & AICPieceResponse & HarvardRecordResponse & RIJKAllPieceResponse
export type {
    AICArtOption,
    AICArtResponse,
    AICAutocomplete,
    AICAutoCompleteResponse,
    AICPieceData,
    AICPieceResponse,
    AICArtSuggestion,

    HarvardArtResponse,
    HarvardInfoResponse,
    HarvardPeopleResponse,
    HarvardRecordResponse,

    Loaded,
    Loading,
    Error
};

export {
    Source,
    toSource,
    AsyncState
};

export type Pagination = {
    total: number;
    limit: number;
    totalPages: number;
    currentPage: number;
}

export type Piece = {
    id: string;
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
export type AutocompleteResponse = AICAutoCompleteResponse & HarvardAutoCompleteResponse & RIJKAllArtResponse

export interface Action<T> {
    type: T;
}

export type Dispatch<T> = Consumer<T>;

export interface ArtQuery {
    search?: string;
    page: number;
    size: number;
    source: Source;
}
