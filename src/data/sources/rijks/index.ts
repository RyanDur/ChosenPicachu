import {RIJKAllArt, RIJKArtObject, RIJKArt} from './types';
import {Art, Piece} from '../types';

export const rijkToArt = (page: number) => (data: RIJKAllArt): Art => ({
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


export const rijkArtObjectToPiece = ({artObject}: RIJKArt): Piece => rijkToPiece(artObject);

export const rijksSearchToOptions = ({artObjects}: RIJKAllArt) =>
    artObjects.map(({title}) => title);