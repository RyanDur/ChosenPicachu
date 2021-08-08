import {Art, ArtResponse, Loaded, Loading, Piece, PieceResponse} from './types';
import {loading, onSuccess} from './actions';
import {Dispatch} from '../components/UserInfo/types';

export type GetPieceAction = Loading | Loaded<Piece>;
export type GetArtAction = Loading | Loaded<Art>;

export const data = {
    getAllArt: (
        page: number,
        dispatch: Dispatch<GetArtAction>,
        domain = 'https://api.artic.edu') => {
        dispatch(loading());
        fetch(`${domain}/api/v1/artworks?page=${page}`)
            .then(response => response.json())
            .then(response => dispatch(onSuccess(responseToArt(response))));
    },

    getPiece: (
        id: string,
        dispatch: Dispatch<GetPieceAction>,
        domain = 'https://api.artic.edu') => {
        dispatch(loading());
        fetch(`${domain}/api/v1/artworks/${id}`)
            .then(response => response.json())
            .then(response => dispatch(onSuccess(responseToArtWork(response))));
    }
};

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
