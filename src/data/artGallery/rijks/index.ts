import {RIJKAllArt, RIJKArtObject, RIJKArt} from './types';
import {AllArt, Art, SearchOptions} from '../types';

export const rijkToAllArt = (page: number) => (data: RIJKAllArt): AllArt => ({
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


export const rijkArtToArt = ({artObject}: RIJKArt): Art => rijkToPiece(artObject);

export const rijksSearchToOptions = ({artObjects}: RIJKAllArt): SearchOptions =>
    artObjects.map(({title}) => title);