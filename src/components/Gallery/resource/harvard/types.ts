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

export const HarvardArtSchema = D.object({
    required: {
        id: D.number,
        title: D.string,
    },
    optional: {
        people: D.array(HarvardPeopleDecoder),
        primaryimageurl: D.nullable(D.string)
    }
});

export const HarvardAllArtSchema = D.object({
    required: {
        info: HarvardInfoDecoder,
        records: D.array(HarvardArtSchema)
    }
});

export const HarvardSearchSchema = D.object({
    required: {
        info: HarvardInfoDecoder,
        records: D.array(HarvardArtOptionDecoder)
    }
});

export type HarvardPeople = D.Output<typeof HarvardPeopleDecoder>;
export type HarvardInfo = D.Output<typeof HarvardInfoDecoder>;
export type HarvardAllArtResponse = D.Output<typeof HarvardAllArtSchema>
export type HarvardArtResponse = D.Output<typeof HarvardArtSchema>
export type HarvardSearchResponse = D.Output<typeof HarvardSearchSchema>;
