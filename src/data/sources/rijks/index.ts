import {RIJKAllArt, RIJKArtObject, RIJKArtResponse} from './types';
import {Art, Piece} from '../types';

export const rijkToArt = (data: RIJKAllArt, page: number): Art => ({
    pagination: {
        total: data.count,
        limit: data.artObjects.length,
        totalPages: data.count / data.artObjects.length,
        currentPage: page,
    },
    pieces: data.artObjects.map(rijkToPiece)
});

const rijkToPiece = (data: RIJKArtObject): Piece => ({
    id: data.objectNumber,
    title: data.title,
    image: data.webImage.url,
    artistInfo: data.longTitle,
    altText: data.longTitle
});



export const toRijkToPiece = ({artObject}: RIJKArtResponse): Piece => rijkToPiece(artObject);

export const rijksAutocompleteToOptions = ({artObjects}: RIJKAllArt) =>
    artObjects.map(({title}) => title);