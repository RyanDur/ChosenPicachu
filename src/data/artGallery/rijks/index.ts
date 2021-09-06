import {RIJKAllArt, RIJKArtObject, RIJKArt} from './types';
import {AllArt, Art} from '../types';

export const rijkToArt = (page: number) => (data: RIJKAllArt): AllArt => ({
    pagination: {
        total: data.count,
        limit: data.artObjects.length,
        totalPages: data.count / data.artObjects.length,
        currentPage: page,
    },
    pieces: data.artObjects.map(rijkToPiece)
});

const rijkToPiece = (data: RIJKArtObject): Art => ({
    id: data.objectNumber,
    title: data.title,
    image: data.webImage.url,
    artistInfo: data.longTitle,
    altText: data.longTitle
});


export const rijkArtObjectToPiece = ({artObject}: RIJKArt): Art => rijkToPiece(artObject);

export const rijksSearchToOptions = ({artObjects}: RIJKAllArt) =>
    artObjects.map(({title}) => title);