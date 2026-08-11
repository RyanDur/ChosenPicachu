import * as schema from 'schemawax';

const HarvardPeopleDecoder = schema.object({
    required: {
        role: schema.string,
        displayname: schema.string
    }
});

const HarvardInfoDecoder = schema.object({
    required: {
        totalrecordsperquery: schema.number,
        totalrecords: schema.number,
        pages: schema.number,
        page: schema.number
    }
});

const HarvardArtOptionDecoder = schema.object({
    required: {
        title: schema.string
    }
});

export const HarvardArtSchema = schema.object({
    required: {
        id: schema.number,
    },
    optional: {
        title: schema.nullable(schema.string),
        people: schema.array(HarvardPeopleDecoder),
        primaryimageurl: schema.nullable(schema.string)
    }
});

export const HarvardAllArtSchema = schema.object({
    required: {
        info: HarvardInfoDecoder,
        records: schema.array(HarvardArtSchema)
    }
});

export const HarvardSearchSchema = schema.object({
    required: {
        info: HarvardInfoDecoder,
        records: schema.array(HarvardArtOptionDecoder)
    }
});

export type HarvardPeople = schema.Output<typeof HarvardPeopleDecoder>;
export type HarvardInfo = schema.Output<typeof HarvardInfoDecoder>;
export type HarvardAllArtResponse = schema.Output<typeof HarvardAllArtSchema>
export type HarvardArtResponse = schema.Output<typeof HarvardArtSchema>
export type HarvardSearchResponse = schema.Output<typeof HarvardSearchSchema>;
