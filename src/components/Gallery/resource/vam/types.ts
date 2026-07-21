import * as D from 'schemawax';

const VAMInfoDecoder = D.object({
    required: {
        record_count: D.number,
        pages: D.number,
        page: D.number,
        page_size: D.number
    }
});

const VAMImagesDecoder = D.object({
    required: {
        _iiif_image_base_url: D.string
    }
});

const VAMMakerDecoder = D.object({
    required: {
        name: D.string
    }
});

const VAMSearchRecordDecoder = D.object({
    required: {
        systemNumber: D.string,
        _primaryTitle: D.string
    },
    optional: {
        _primaryMaker: VAMMakerDecoder,
        _images: VAMImagesDecoder
    }
});

export const VAMAllArtSchema = D.object({
    required: {
        info: VAMInfoDecoder,
        records: D.array(VAMSearchRecordDecoder)
    }
});

const VAMNameDecoder = D.object({
    required: {
        text: D.string
    }
});

const VAMPersonDecoder = D.object({
    required: {
        name: VAMNameDecoder
    }
});

const VAMTitleDecoder = D.object({
    required: {
        title: D.string
    }
});

const VAMDetailRecordDecoder = D.object({
    required: {
        systemNumber: D.string,
        objectType: D.string
    },
    optional: {
        titles: D.array(VAMTitleDecoder),
        artistMakerPerson: D.array(VAMPersonDecoder),
        images: D.array(D.string)
    }
});

export const VAMArtSchema = D.object({
    required: {
        record: VAMDetailRecordDecoder
    }
});

export type VAMInfo = D.Output<typeof VAMInfoDecoder>;
export type VAMSearchRecord = D.Output<typeof VAMSearchRecordDecoder>;
export type VAMAllArtResponse = D.Output<typeof VAMAllArtSchema>;
export type VAMArtResponse = D.Output<typeof VAMArtSchema>;
