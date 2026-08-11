import * as schema from 'schemawax';

const AICThumbnailDecoder = schema.object({
  optional: {
    alt_text: schema.string
  }
});
const AICPaginationResponseDecoder = schema.object({
  required: {
    total: schema.number,
    limit: schema.number,
    total_pages: schema.number,
    current_page: schema.number
  }
});
export const AICPieceResponseDecoder = schema.object({
  required: {
    id: schema.number,
    title: schema.string,
    term_titles: schema.array(schema.string),
    artist_display: schema.string
  },
  optional: {
    image_id: schema.nullable(schema.string),
    thumbnail: schema.nullable(AICThumbnailDecoder)
  }
});
export const AICAllArtSchema = schema.object({
  required: {
    pagination: AICPaginationResponseDecoder,
    data: schema.array(AICPieceResponseDecoder)
  }
});
export const AICArtSchema = schema.object({
  required: {
    data: AICPieceResponseDecoder
  }
});
const AICArtOptionDecoder = schema.object({
  required: {
    input: schema.array(schema.string)
  }
});
const AICAutocompleteDecoder = schema.object({
  required: {
    suggest_autocomplete_all: schema.tuple(schema.object({}), AICArtOptionDecoder)
  }
});

export const AICSearchSchema = schema.object({
  required: {
    pagination: AICPaginationResponseDecoder,
    data: schema.array(AICAutocompleteDecoder)
  }
});

export type AICPieceData = {
  data: AICArt;
}

export type AICArtResponse = schema.Output<typeof AICArtSchema>;
export type AICAllArtResponse = schema.Output<typeof AICAllArtSchema>;
export type AICSearchResponse = schema.Output<typeof AICSearchSchema>;
export type AICArt = schema.Output<typeof AICPieceResponseDecoder>;
