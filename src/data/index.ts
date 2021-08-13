import {
    Art,
    ArtOption,
    ArtResponse,
    ArtSuggestion, Autocomplete, AutoCompleteResponse,
    Piece,
    PieceData,
    PieceResponse
} from './types';
import {GetArtAction, GetPieceAction, loading, onError, onSuccess, SearchArtAction} from './actions';
import {Dispatch} from '../components/UserInfo/types';

export const fields = 'fields=id,title,image_id,artist_display,term_titles,thumbnail';
const artInstituteOfChicago = 'https://api.artic.edu';

export const data = {
    searchForArtOptions: (
        searchString: string,
        dispatch: Dispatch<SearchArtAction>,
        domain = artInstituteOfChicago
    ): void => {
        fetch(`${domain}/api/v1/artworks?q=${searchString}&fields=suggest_autocomplete_all`)
            .then(async response => {
                if (response.status === 200) dispatch(onSuccess(responseToArtOptions(await response.json())));
            });
    },

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
    pieces: response.data.map(toPiece),
    baseUrl: response.config.website_url
});

const responseToArtWork = ({data}: PieceResponse): Piece => toPiece(data);

const toPiece = (data: PieceData) => ({
    id: data.id,
    title: data.title,
    imageId: data.image_id,
    artistInfo: data.artist_display,
    altText: data.thumbnail?.alt_text || data.term_titles.join(' ') || ''
});

const responseToArtOptions = ({data}: AutoCompleteResponse): ArtSuggestion[] => {
    return data.map(({suggest_autocomplete_all}: Autocomplete) => suggest_autocomplete_all[1])
        .flatMap((option: ArtOption) => option.input);
};
