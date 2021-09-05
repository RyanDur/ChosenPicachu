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

export const RIJKAllArtDecoder = D.object({
    required: {
        count: D.number,
        artObjects: D.array(RIJKPieceDecoder)
    }
});

export const RIJKArtDecoder = D.object({
    required: {
        artObject: RIJKPieceDecoder
    }
});

export type RIJKArtObject = D.Output<typeof RIJKPieceDecoder>;
export type RIJKAllArt = D.Output<typeof RIJKAllArtDecoder>;
export type RIJKArtResponse = D.Output<typeof RIJKArtDecoder>;
export type RIJKPiece = D.Output<typeof RIJKArtDecoder>;