import {
    Art,
    ArtOption,
    ArtResponse,
    ArtSuggestion, Autocomplete, AutoCompleteResponse,
    Piece,
    PieceData,
    PieceResponse
} from './types';
import {GetArtAction, GetPieceAction, loading, error, success, SearchArtAction} from './actions';
import {Dispatch} from '../components/UserInfo/types';
import {toQueryString} from '../util/URL';

export const fields = 'fields=id,title,image_id,artist_display,term_titles,thumbnail';
const artInstituteOfChicago = 'https://api.artic.edu';
const apiBase = '/api/v1/artworks';

export const data = {
    searchForArtOptions: (
        searchString: string,
        dispatch: Dispatch<SearchArtAction>,
        domain = artInstituteOfChicago
    ): void => {
        const params = {
            'query[term][title]': searchString,
            fields: 'suggest_autocomplete_all',
            limit: 5
        };
        fetch(`${domain}${apiBase}/search${toQueryString(params)}`)
            .then(async response => {
                if (response.status === 200) dispatch(success(responseToArtOptions(await response.json())));
            });
    },

    getAllArt: (
        {search, page}: Record<string, unknown>,
        dispatch: Dispatch<GetArtAction>,
        domain = artInstituteOfChicago) => {
        dispatch(loading());
        const url = search ?
            `${domain}${apiBase}/search${toQueryString({q: search, page})}&${fields}&limit=12` :
            `${domain}${apiBase}${toQueryString({page})}&${fields}`;
        fetch(url).then(async response => {
            if (response.status === 200) dispatch(success(responseToArt(await response.json())));
            else dispatch(error());
        });
    },

    getPiece: (
        id: string,
        dispatch: Dispatch<GetPieceAction>,
        domain = artInstituteOfChicago) => {
        dispatch(loading());
        fetch(`${domain}${apiBase}/${id}?${fields}`).then(async response => {
            if (response.status === 200) dispatch(success(responseToArtWork(await response.json())));
            else dispatch(error());
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
    pieces: response.data.map(toPiece)
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
