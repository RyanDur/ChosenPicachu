import {Art, ArtResponse, Loaded, Loading, Piece, PieceResponse, StateChange} from './types';
import {loaded, loading} from './actions';

export type GetPieceState = Loading | Loaded<Piece>;

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

    getPiece(
        id: string,
        state: (state: GetPieceState) => void,
        domain = 'https://api.artic.edu') {
        state(loading());
        fetch(`${domain}/api/v1/artworks/${id}`)
            .then(response => response.json())
            .then(response => state(loaded(responseToArtWork(response))));
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
