import * as D from 'schemawax';

const AICThumbnailDecoder = D.object({
    optional: {
        alt_text: D.string
    }
});
const AICPaginationResponseDecoder = D.object({
    required: {
        total: D.number,
        limit: D.number,
        total_pages: D.number,
        current_page: D.number
    }
});
export const AICPieceResponseDecoder = D.object({
    required: {
        id: D.number,
        title: D.string,
        term_titles: D.array(D.string),
        artist_display: D.string
    },
    optional: {
        image_id: D.nullable(D.string),
        thumbnail: D.nullable(AICThumbnailDecoder)
    }
});
export const AICAllArtResponseSchema = D.object({
    required: {
        pagination: AICPaginationResponseDecoder,
        data: D.array(AICPieceResponseDecoder)
    }
});
export const AICArtResponseSchema = D.object({
    required: {
        data: AICPieceResponseDecoder
    }
});

const AICArtOptionDecoder = D.object({
    required: {
        input: D.array(D.string)
    }
});

const AICAutocompleteDecoder = D.object({
    required: {
        suggest_autocomplete_all: D.tuple(D.object({}), AICArtOptionDecoder)
    }
});
export const AICSearchResponseSchema = D.object({
    required: {
        pagination: AICPaginationResponseDecoder,
        data: D.array(AICAutocompleteDecoder)
    }
});

export type AICPieceData = {
    data: AICArt;
}

export type AICArtOption = D.Output<typeof AICArtOptionDecoder>;
export type AICSearchResponse = D.Output<typeof AICSearchResponseSchema>;
export type AICArt = D.Output<typeof AICPieceResponseDecoder>;
export type AICAllArt = D.Output<typeof AICAllArtResponseSchema>;

