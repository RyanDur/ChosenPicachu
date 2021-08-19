import {ArtOption, ArtResponse, Autocomplete, AutoCompleteResponse, Dispatch, PieceData, PieceResponse} from './types';
import {error, GetArtAction, GetPieceAction, loaded, loading, SearchArtAction} from './actions';
import {HTTPAction} from './http/actions';
import {HTTPStatus} from './http/types';
import {http} from './http';

const apiBase = '/api/v1/artworks';
const shapeOfResponse = ['id', 'title', 'image_id', 'artist_display', 'term_titles', 'thumbnail'];

export const data = {
    searchForArtOptions: (searchString: string, dispatch: Dispatch<SearchArtAction>): void => {
        dispatch(loading());
        http({
            path: `${apiBase}/search`,
            queryParams: {
                'query[term][title]': searchString,
                fields: 'suggest_autocomplete_all',
                limit: 5
            }
        }).then((action: HTTPAction<AutoCompleteResponse>) => {
            if (action.type === HTTPStatus.SUCCESS) {
                dispatch(loaded(action.value.data
                    .map(({suggest_autocomplete_all}: Autocomplete) => suggest_autocomplete_all[1])
                    .flatMap((option: ArtOption) => option.input)));
            }
        });
    },

    getAllArt: ({search, page}: Record<string, unknown>, dispatch: Dispatch<GetArtAction>): void => {
        const queryParams = {page, fields: shapeOfResponse, limit: 12};
        dispatch(loading());
        http(search ?
            {path: `${apiBase}/search`, queryParams: {q: search, ...queryParams}} :
            {path: apiBase, queryParams}).then((action: HTTPAction<ArtResponse>) => {
            switch (action.type) {
                case HTTPStatus.FAILURE:
                    return dispatch(error());
                case HTTPStatus.SUCCESS:
                    return dispatch(loaded(toArt(action.value)));
            }
        });
    },

    getPiece: (id: string, dispatch: Dispatch<GetPieceAction>): void => {
        dispatch(loading());
        http({
            path: `${apiBase}/${id}`,
            queryParams: {fields: shapeOfResponse}
        }).then((action: HTTPAction<PieceResponse>) => {
            switch (action.type) {
                case HTTPStatus.FAILURE:
                    return dispatch(error());
                case HTTPStatus.SUCCESS:
                    return dispatch(loaded(toPiece(action.value.data)));
            }
        });
    }
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
