import * as D from 'schemawax';

const RIJKImageDecoder = D.object({
    required: {
        url: D.nullable(D.string)
    }
});

export const RIJKPieceDecoder = D.object({
    required: {
        id: D.string,
        objectNumber: D.string,
        title: D.string,
        longTitle: D.string,
        webImage: RIJKImageDecoder
    },
    optional: {
        principalOrFirstMaker: D.string
    }
});

export const RIJKAllArtSchema = D.object({
    required: {
        count: D.number,
        artObjects: D.array(RIJKPieceDecoder)
    }
});

export const RIJKSSearchSchema = D.object({
    required: {
        count: D.number,
        artObjects: D.array(RIJKPieceDecoder)
    }
});


export const RIJKArtSchema = D.object({
    required: {
        artObject: RIJKPieceDecoder
    }
});

export type RIJKArtObject = D.Output<typeof RIJKPieceDecoder>;
export type RIJKSAllArt = D.Output<typeof RIJKAllArtSchema>;
export type RIJKSArt = D.Output<typeof RIJKArtSchema>;
export type RIJSearch = D.Output<typeof RIJKSSearchSchema>;