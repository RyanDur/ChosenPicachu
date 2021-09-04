import * as D from 'schemawax';

const AICThumbnailDecoder = D.object({
    required: {
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
        image_id: D.string,
        artist_display: D.string
    },
    optional: {
        thumbnail: AICThumbnailDecoder
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
    data: AICPieceResponse;
}

export type AICArtOption = D.Output<typeof AICArtOptionDecoder>
export type AICAutocomplete = D.Output<typeof AICAutocompleteDecoder>;
export type AICAutoCompleteResponse = D.Output<typeof AICAutoCompleteResponseDecoder>
export type AICPieceResponse = D.Output<typeof AICPieceResponseDecoder>
export type AICAllArtResponse = D.Output<typeof AICAllArtResponseDecoder>
export type AICArtResponse = D.Output<typeof AICArtResponseDecoder>
export type AICArtSuggestion = D.Output<typeof AICArtSuggestionDecoder>;
