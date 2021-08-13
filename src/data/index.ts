import {Art, ArtResponse, Piece, PieceResponse} from './types';
import {GetArtAction, GetPieceAction, loading, onError, onSuccess} from './actions';
import {Dispatch} from '../components/UserInfo/types';

export const fields = 'fields=id,title,image_id,artist_display,term_titles,thumbnail';
const artInstituteOfChicago = 'https://api.artic.edu';

export const data = {
    getAllArt: (
        page: number,
        dispatch: Dispatch<GetArtAction>,
        domain = artInstituteOfChicago) => {
        dispatch(loading());
        fetch(`${domain}/api/v1/artworks?page=${page}&${fields}`).then(async response => {
            if (response.status === 200) dispatch(onSuccess(responseToArt(await response.json())));
            else dispatch(onError());
        });
    },

    getPiece: (
        id: string,
        dispatch: Dispatch<GetPieceAction>,
        domain = artInstituteOfChicago) => {
        dispatch(loading());
        fetch(`${domain}/api/v1/artworks/${id}?${fields}`).then(async response => {
            if (response.status === 200) dispatch(onSuccess(responseToArtWork(await response.json())));
            else dispatch(onError());
        });
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
