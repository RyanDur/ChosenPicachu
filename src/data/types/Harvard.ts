export interface HarvardArtResponse {
    info: HarvardInfoResponse;
    records: HarvardRecordResponse[];
}

export interface HarvardRecordResponse {
    id: number;
    title: string;
    people: HarvardPeopleResponse[];
    primaryimageurl: string;
}

export interface HarvardPeopleResponse {
    role: string;
    birthplace?: string;
    gender: string;
    displaydate: string;
    prefix?:string;
    culture: string;
    displayname: string;
    alphasort: string;
    name: string;
    personid: number;
    deathplace?: string;
    displayorder: number;
}

export interface HarvardInfoResponse {
    totalrecordsperquery: number;
    totalrecords: number;
    pages: number;
    page: number;
    next: string;
}

export type HarvardArtSuggestion = string;

export interface HarvardArtOption {
    title: HarvardArtSuggestion;
}

export interface HarvardAutoCompleteResponse {
    info: HarvardInfoResponse;
    records: HarvardArtOption[]
}