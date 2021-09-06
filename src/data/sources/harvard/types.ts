import * as D from 'schemawax';

const HarvardPeopleDecoder = D.object({
    required: {
        role: D.string,
        displayname: D.string
    }
});

const HarvardInfoDecoder = D.object({
    required: {
        totalrecordsperquery: D.number,
        totalrecords: D.number,
        pages: D.number,
        page: D.number
    }
});

const HarvardArtOptionDecoder = D.object({
    required: {
        title: D.string
    }
});

export const HarvardArtDecoder = D.object({
    required: {
        id: D.number,
        title: D.string,
    },
    optional: {
        people: D.array(HarvardPeopleDecoder),
        primaryimageurl: D.nullable(D.string)
    }
});

export const HarvardAllArtDecoder = D.object({
    required: {
        info: HarvardInfoDecoder,
        records: D.array(HarvardArtDecoder)
    }
});

export const HarvardSearchDecoder = D.object({
    required: {
        info: HarvardInfoDecoder,
        records: D.array(HarvardArtOptionDecoder)
    }
});

export type HarvardPeople = D.Output<typeof HarvardPeopleDecoder>;
export type HarvardInfo = D.Output<typeof HarvardInfoDecoder>;
export type HarvardAllArt = D.Output<typeof HarvardAllArtDecoder>
export type HarvardArt = D.Output<typeof HarvardArtDecoder>
export type HarvardSearchResponse = D.Output<typeof HarvardSearchDecoder>;