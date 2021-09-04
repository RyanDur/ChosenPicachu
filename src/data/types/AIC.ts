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
export const AICAllArtResponseDecoder = D.object({
    required: {
        pagination: AICPaginationResponseDecoder,
        data: D.array(AICPieceResponseDecoder)
    }
});
export const AICArtResponseDecoder = D.object({
    required: {
        data: AICPieceResponseDecoder
    }
});

const AICArtSuggestionDecoder = D.string;

const AICArtOptionDecoder = D.object({
   required:  {
       input: AICArtSuggestionDecoder
   }
});
const AICAutocompleteDecoder = D.object({
    required: {
        suggest_autocomplete_all: D.tuple(D.unknown, AICArtOptionDecoder)
    }
});
export const AICAutoCompleteResponseDecoder = D.object({
    required: {
        pagination: AICPaginationResponseDecoder,
        data: D.array(AICAutocompleteDecoder)
    }
});

export type AICPieceData = {
    data: AICArt;
}

export type AICArtOption = D.Output<typeof AICArtOptionDecoder>
export type AICAutocomplete = D.Output<typeof AICAutocompleteDecoder>;
export type AICAutoCompleteResponse = D.Output<typeof AICAutoCompleteResponseDecoder>

export type AICArt = D.Output<typeof AICPieceResponseDecoder>

export type AICAllArt = D.Output<typeof AICAllArtResponseDecoder>
export type AICArtSuggestion = D.Output<typeof AICArtSuggestionDecoder>;
