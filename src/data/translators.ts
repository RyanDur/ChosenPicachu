import {
    AICAllArt,
    AICArt,
    AICAutoCompleteResponse,
    AICPieceData,
    Art,
    HarvardAllArt,
    HarvardPiece,
    Piece
} from './types';
import {RIJKAllArt, RIJKArtObject, RIJKArtResponse} from './types/RIJK';
import {HarvardAutoCompleteResponse} from './types/Harvard';

export const aicToArt = ({pagination, data}: AICAllArt): Art => ({
    pagination: {
        total: pagination.total,
        limit: pagination.limit,
        totalPages: pagination.total_pages,
        currentPage: pagination.current_page,
    },
    pieces: data.map(aicToPiece)
});

const aicToPiece = (data: AICArt): Piece => ({
    id: String(data.id),
    title: data.title,
    image: `https://www.artic.edu/iiif/2/${data.image_id}/full/2000,/0/default.jpg`,
    artistInfo: data.artist_display,
    altText: data.thumbnail?.alt_text || data.term_titles.join(' ') || ''
});

export const aicDataToPiece = ({data}: AICPieceData): Piece => aicToPiece(data);

export const harvardToArt = ({info, records}: HarvardAllArt): Art => ({
    pagination: {
        total: info.totalrecords,
        limit: info.totalrecordsperquery,
        totalPages: info.pages,
        currentPage: info.page,
    },
    pieces: records.map(harvardToPiece)
});

export const harvardToPiece = (record: HarvardPiece): Piece => ({
    id: String(record.id),
    title: record.title,
    image: record.primaryimageurl,
    artistInfo: record.people?.find(person => person.role === 'Artist')?.displayname || 'Unknown',
    altText: record.title
});

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

export const aicAutocompleteToOptions = ({data}: AICAutoCompleteResponse) => data
    .map(({suggest_autocomplete_all}) => suggest_autocomplete_all[1])
    .flatMap(option => option.input);

export const harverdAutocompleteToOptions = ({records}: HarvardAutoCompleteResponse) =>
    records.map(({title}) => title);

export const rijksAutocompleteToOptions = ({artObjects}: RIJKAllArt) =>
    artObjects.map(({title}) => title);