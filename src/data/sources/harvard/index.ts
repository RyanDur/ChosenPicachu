import {HarvardAllArt, HarvardAutoCompleteResponse, HarvardPiece} from './types';
import {Art, Piece} from '../types';

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

export const harverdAutocompleteToOptions = ({records}: HarvardAutoCompleteResponse) =>
    records.map(({title}) => title);
