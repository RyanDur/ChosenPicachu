import {
    ArtOption,
    ArtResponse,
    AsyncState,
    Autocomplete,
    AutoCompleteResponse,
    Dispatch,
    PieceData,
    PieceResponse
} from './types';
import {error, GetArtAction, GetPieceAction, HTTPAction, loading, SearchArtAction, success} from './actions';
import {http} from './http';

const apiBase = '/api/v1/artworks';
const shapeOfResponse = ['id', 'title', 'image_id', 'artist_display', 'term_titles', 'thumbnail'];

export const data = {
    searchForArtOptions: (
        searchString: string,
        dispatch: Dispatch<SearchArtAction>
    ): void => http({
        path: `${apiBase}/search`,
        queryParams: {'query[term][title]': searchString, fields: 'suggest_autocomplete_all', limit: 5}
    }, (action: HTTPAction<AutoCompleteResponse>) => {
        if (action.type === AsyncState.SUCCESS) {
            dispatch(success(action.value.data
                .map(({suggest_autocomplete_all}: Autocomplete) => suggest_autocomplete_all[1])
                .flatMap((option: ArtOption) => option.input)));
        }
    }),

    getAllArt: (
        {search, page}: Record<string, unknown>,
        dispatch: Dispatch<GetArtAction>
    ): void => {
        const queryParams = {page, fields: shapeOfResponse, limit: 12};
        http(search ?
            {path: `${apiBase}/search`, queryParams: {q: search, ...queryParams}} :
            {path: apiBase, queryParams}, (action: HTTPAction<ArtResponse>) => {
            switch (action.type) {
                case AsyncState.LOADING:
                    return dispatch(loading());
                case AsyncState.ERROR:
                    return dispatch(error());
                case AsyncState.SUCCESS: {
                    return dispatch(success(toArt(action.value)));
                }
            }
        });
    },

    getPiece: (
        id: string,
        dispatch: Dispatch<GetPieceAction>
    ): void => http({
        path: `${apiBase}/${id}`,
        queryParams: {fields: shapeOfResponse}
    }, (action: HTTPAction<PieceResponse>) => {
        switch (action.type) {
            case AsyncState.LOADING:
                return dispatch(loading());
            case AsyncState.ERROR:
                return dispatch(error());
            case AsyncState.SUCCESS:
                return dispatch(success(toPiece(action.value.data)));
        }
    })
};

const toArt = ({pagination, data}: ArtResponse) => ({
    pagination: {
        total: pagination.total,
        limit: pagination.limit,
        offset: pagination.offset,
        totalPages: pagination.total_pages,
        currentPage: pagination.current_page,
        nextUrl: pagination.next_url
    },
    pieces: data.map(toPiece)
});

const toPiece = (data: PieceData) => ({
    id: data.id,
    title: data.title,
    imageId: data.image_id,
    artistInfo: data.artist_display,
    altText: data.thumbnail?.alt_text || data.term_titles.join(' ') || ''
});
