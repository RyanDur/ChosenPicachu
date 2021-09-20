import {AICAllArt, AICAllArtSchema, AICArt, AICArtSchema, AICPieceData, AICSearch, AICSearchSchema} from './types';
import {AllArt, Art, SearchOptions} from '../types';
import {validate} from '../../http';

const aicToPiece = (data: AICArt): Art => ({
    id: String(data.id),
    title: data.title,
    image: `https://www.artic.edu/iiif/2/${data.image_id}/full/2000,/0/default.jpg`,
    artistInfo: data.artist_display,
    altText: data.thumbnail?.alt_text || data.term_titles.join(' ') || ''
});

export const aic = {
    response: {
        toAllArt: ({pagination, data}: AICAllArt): AllArt => ({
            pagination: {
                total: pagination.total,
                limit: pagination.limit,
                totalPages: pagination.total_pages,
                currentPage: pagination.current_page,
            },
            pieces: data.map(aicToPiece)
        }),

        toArt: ({data}: AICPieceData): Art => aicToPiece(data),

        toSearchOptions: ({data}: AICSearch): SearchOptions => data
            .map(({suggest_autocomplete_all}) => suggest_autocomplete_all[1])
            .flatMap(option => option.input),
    },
    validate: {
        art: validate(AICArtSchema),
        allArt: validate(AICAllArtSchema),
        searchOptions: validate(AICSearchSchema)
    }
};
