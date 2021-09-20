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
    response: {
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

        toSearchOptions: ({artObjects}: RIJKSAllArt): SearchOptions =>
            artObjects.map(({title}) => title),

    },
    validate: {
        allArt: validate(RIJKAllArtSchema),
        art: validate(RIJKArtSchema),
        searchOptions: validate(RIJKSSearchSchema)
    }
};