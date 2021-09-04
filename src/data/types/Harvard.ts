import * as D from 'schemawax';

const HarvardPeopleResponseDecoder = D.object({
    required: {
        role: D.string,
        displayname: D.string
    }
});

export const HarvardRecordResponseDecoder = D.object({
    required: {
        id: D.number,
        title: D.string,
    },
    optional: {
        people: D.array(HarvardPeopleResponseDecoder),
        primaryimageurl: D.string
    }
});

const HarvardInfoResponseDecoder = D.object({
    required: {
        totalrecordsperquery: D.number,
        totalrecords: D.number,
        pages: D.number,
        page: D.number
    }
});

export const HarvardArtResponseDecoder = D.object({
    required: {
        info: HarvardInfoResponseDecoder,
        records: D.array(HarvardRecordResponseDecoder)
    }
});
const HarvardArtSuggestionDecoder = D.string;
const HarvardArtOptionDecoder = D.object({
    required: {
        title: HarvardArtSuggestionDecoder
    }
});
export const HarvardAutoCompleteResponseDecoder = D.object({
    required: {
        info: HarvardInfoResponseDecoder,
        records: D.array(HarvardArtOptionDecoder)
    }
});

export type HarvardArtResponse = D.Output<typeof HarvardArtResponseDecoder>
export type HarvardInfoResponse = D.Output<typeof HarvardInfoResponseDecoder>;
export type HarvardRecordResponse = D.Output<typeof HarvardRecordResponseDecoder>
export type HarvardPeopleResponse = D.Output<typeof HarvardPeopleResponseDecoder>
export type HarvardArtSuggestion = D.Output<typeof HarvardArtSuggestionDecoder>;
export type HarvardAutoCompleteResponse = D.Output<typeof HarvardAutoCompleteResponseDecoder>;