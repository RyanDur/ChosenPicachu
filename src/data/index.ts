import {Consumer} from '../components/UserInfo/types';
import {Art, ArtResponse, Piece, PieceResponse} from './types';

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
        imageId: piece.image_id,
        artistInfo: piece.artist_display,
        altText: piece.term_titles.join(' ')
    })),
    baseUrl: response.config.website_url
});

const responseToArtWork = ({data}: PieceResponse): Piece => ({
    id: data.id,
    title: data.title,
    imageId: data.image_id,
    artistInfo: data.artist_display,
    altText: data.thumbnail?.alt_text || ''
});

export interface StateChange<T> {
    onSuccess: Consumer<T>;
    onLoading: Consumer<boolean>;
}

export const data = {
    getAllArt: (page: number, {onSuccess, onLoading}: StateChange<Art>,
                domain = 'https://api.artic.edu') => {
        onLoading(true);
        fetch(`${domain}/api/v1/artworks?page=${page}`)
            .then<ArtResponse>(response => response.json())
            .then(response => {
                onSuccess(responseToArt(response));
                onLoading(false);
            });
    },

    getPiece(id: string, onSuccess: Consumer<Piece>,
             domain = 'https://api.artic.edu') {
        fetch(`${domain}/api/v1/artworks/${id}`)
            .then(response => response.json())
            .then(response => onSuccess(responseToArtWork(response)));
    }
};