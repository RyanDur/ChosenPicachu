import {
    Art,
    ArtOption,
    ArtResponse,
    ArtSuggestion,
    Autocomplete,
    AutoCompleteResponse,
    Dispatch,
    Piece,
    PieceData,
    PieceResponse
} from './types';
import {error, GetArtAction, GetPieceAction, loading, SearchArtAction, success} from './actions';
import {toQueryString} from '../util/URL';

export const fields = 'fields=id,title,image_id,artist_display,term_titles,thumbnail';
const artInstituteOfChicago = 'https://api.artic.edu';
const apiBase = '/api/v1/artworks';

const get = (url: string, dispatch: Dispatch<any>, onSuccess: (a: any) => any) => {
    dispatch(loading());
    fetch(url).then(async response => {
        if (response.status === 200) dispatch(success(onSuccess(await response.json())));
        else dispatch(error());
    });
};

export const data = {
    searchForArtOptions: (
        searchString: string,
        dispatch: Dispatch<SearchArtAction>,
        domain = artInstituteOfChicago
    ): void => get(`${domain}${apiBase}/search${toQueryString({
        'query[term][title]': searchString,
        fields: 'suggest_autocomplete_all',
        limit: 5
    })}`, dispatch, ({data}: AutoCompleteResponse): ArtSuggestion[] => data
        .map(({suggest_autocomplete_all}: Autocomplete) => suggest_autocomplete_all[1])
        .flatMap((option: ArtOption) => option.input)),

    getAllArt: (
        {search, page}: Record<string, unknown>,
        dispatch: Dispatch<GetArtAction>,
        domain = artInstituteOfChicago) => get(search ?
            `${domain}${apiBase}/search${toQueryString({q: search, page})}&${fields}&limit=12` :
            `${domain}${apiBase}${toQueryString({page})}&${fields}`, dispatch,
        ({pagination, data}: ArtResponse): Art => ({
            pagination: {
                total: pagination.total,
                limit: pagination.limit,
                offset: pagination.offset,
                totalPages: pagination.total_pages,
                currentPage: pagination.current_page,
                nextUrl: pagination.next_url
            },
            pieces: data.map(toPiece)
        })),

    getPiece: (
        id: string,
        dispatch: Dispatch<GetPieceAction>,
        domain = artInstituteOfChicago) =>
        get(`${domain}${apiBase}/${id}?${fields}`, dispatch, ({data}: PieceResponse): Piece => toPiece(data))
};

const toPiece = (data: PieceData) => ({
    id: data.id,
    title: data.title,
    imageId: data.image_id,
    artistInfo: data.artist_display,
    altText: data.thumbnail?.alt_text || data.term_titles.join(' ') || ''
});
