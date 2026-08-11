import * as schema from 'schemawax';

const VAMInfoDecoder = schema.object({
    required: {
        record_count: schema.number,
        pages: schema.number,
        page: schema.number,
        page_size: schema.number
    }
});

const VAMImagesDecoder = schema.object({
    required: {
        _iiif_image_base_url: schema.string
    }
});

const VAMMakerDecoder = schema.object({
    required: {
        name: schema.string
    }
});

const VAMSearchRecordDecoder = schema.object({
    required: {
        systemNumber: schema.string,
        _primaryTitle: schema.string
    },
    optional: {
        _primaryMaker: VAMMakerDecoder,
        _images: VAMImagesDecoder
    }
});

export const VAMAllArtSchema = schema.object({
    required: {
        info: VAMInfoDecoder,
        records: schema.array(VAMSearchRecordDecoder)
    }
});

const VAMNameDecoder = schema.object({
    required: {
        text: schema.string
    }
});

const VAMPersonDecoder = schema.object({
    required: {
        name: VAMNameDecoder
    }
});

const VAMTitleDecoder = schema.object({
    required: {
        title: schema.string
    }
});

const VAMDetailRecordDecoder = schema.object({
    required: {
        systemNumber: schema.string,
        objectType: schema.string
    },
    optional: {
        titles: schema.array(VAMTitleDecoder),
        artistMakerPerson: schema.array(VAMPersonDecoder),
        images: schema.array(schema.string)
    }
});

export const VAMArtSchema = schema.object({
    required: {
        record: VAMDetailRecordDecoder
    }
});

export type VAMInfo = schema.Output<typeof VAMInfoDecoder>;
export type VAMSearchRecord = schema.Output<typeof VAMSearchRecordDecoder>;
export type VAMAllArtResponse = schema.Output<typeof VAMAllArtSchema>;
export type VAMArtResponse = schema.Output<typeof VAMArtSchema>;
