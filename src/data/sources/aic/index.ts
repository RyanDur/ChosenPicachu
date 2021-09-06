import {AICAllArt, AICArt, AICSearchResponse, AICPieceData} from './types';
import {Art, Piece} from '../types';

export const aicAutocompleteToOptions = ({data}: AICSearchResponse) => data
    .map(({suggest_autocomplete_all}) => suggest_autocomplete_all[1])
    .flatMap(option => option.input);

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
