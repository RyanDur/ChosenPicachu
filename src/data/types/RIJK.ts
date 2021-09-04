import * as D from 'schemawax';

const RIJKImageResponseDecoder = D.object({
  required: {
      url: D.string
  }
});

export const RIJKArtObjectDecoder = D.object({
    required: {
        id: D.string,
        objectNumber: D.string,
        title: D.string,
        longTitle: D.string,
        webImage: RIJKImageResponseDecoder
    },
    optional: {
        principalOrFirstMaker: D.string
    }
});

export const RIJKAllArtResponseDecoder = D.object({
    required: {
        count: D.number,
        artObjects: D.array(RIJKArtObjectDecoder)
    }
});

export const RIJKArtObjectResponseDecoder = D.object({
    required: {
        artObject: RIJKArtObjectDecoder
    }
});

export type RIJKArtObject = D.Output<typeof RIJKArtObjectDecoder>;
export type RIJKAllArtResponse = D.Output<typeof RIJKAllArtResponseDecoder>;
export type RIJKArtObjectResponse = D.Output<typeof RIJKArtObjectResponseDecoder>;
export type RIJKAllPieceResponse = D.Output<typeof RIJKArtObjectResponseDecoder>;