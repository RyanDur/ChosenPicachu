import {AICAllArt, AICArt, AICSearchResponse, AICPieceData} from './types';
import {AllArt, Art, SearchOptions} from '../types';

export const aicSearchToSearch = ({data}: AICSearchResponse): SearchOptions => data
    .map(({suggest_autocomplete_all}) => suggest_autocomplete_all[1])
    .flatMap(option => option.input);

export const aicToAllArt = ({pagination, data}: AICAllArt): AllArt => ({
    pagination: {
        total: pagination.total,
        limit: pagination.limit,
        totalPages: pagination.total_pages,
        currentPage: pagination.current_page,
    },
    pieces: data.map(aicToPiece)
});

const aicToPiece = (data: AICArt): Art => ({
    id: String(data.id),
    title: data.title,
    image: `https://www.artic.edu/iiif/2/${data.image_id}/full/2000,/0/default.jpg`,
    artistInfo: data.artist_display,
    altText: data.thumbnail?.alt_text || data.term_titles.join(' ') || ''
});

export const aicArtToArt = ({data}: AICPieceData): Art => aicToPiece(data);
