import {RIJKSAllArt, RIJKArtObject, RIJKSArt, RIJKAllArtSchema, RIJKArtSchema, RIJKSSearchSchema} from './types';
import {AllArt, Art, SearchOptions} from '../types';
import {validate} from '../../http';

const rijkToPiece = (data: RIJKArtObject): Art => ({
    id: data.objectNumber,
    title: data.title,
    image: data.webImage.url,
    artistInfo: data.longTitle,
    altText: data.longTitle
});

export const rijks = {
    toAllArt: (page: number) => (data: RIJKSAllArt): AllArt => ({
        pagination: {
            total: data.count,
            limit: data.artObjects.length,
            totalPages: data.count / data.artObjects.length,
            currentPage: page,
        },
        pieces: data.artObjects.map(rijkToPiece)
    }),

    toArt: ({artObject}: RIJKSArt): Art => rijkToPiece(artObject),

    toSearch: ({artObjects}: RIJKSAllArt): SearchOptions =>
        artObjects.map(({title}) => title),

    validateAllArt: validate(RIJKAllArtSchema),
    validateArt: validate(RIJKArtSchema),
    validateSearch: validate(RIJKSSearchSchema)
};