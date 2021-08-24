export interface HarvardArtResponse {
    info: InfoResponse;
    records: RecordResponse[];
}

export interface RecordResponse {
    id: number;
    title: string;
    people: PeopleResponse[];
    primaryimageurl: string;
}

export interface PeopleResponse {
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

export interface InfoResponse {
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
    info: InfoResponse;
    records: HarvardArtOption[]
}