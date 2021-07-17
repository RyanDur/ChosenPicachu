import {Consumer} from '../components/UserInfo/types';
import {Art, ArtResponse} from './types';

const responseToArt = (response: ArtResponse): Art => ({
    pagination: {
        total: response.pagination.total,
        limit: response.pagination.limit,
        offset: response.pagination.offset,
        totalPages: response.pagination.total_pages,
        currentPage: response.pagination.current_page,
        nextUrl: response.pagination.next_url
    },
    pieces: response.data.map(piece => ({
        id: piece.id,
        title: piece.title,
        imageId: piece.image_id
    })),
    baseUrl: response.config.website_url
});

export const data = {
    getAllArt: (onSuccess: Consumer<Art>, domain = 'https://api.artic.edu'): void =>
        void fetch(`${domain}/api/v1/artworks`)
            .then<ArtResponse>(response => response.json())
            .then(response => onSuccess(responseToArt(response))),
};