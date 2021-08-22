import {
    ArtOption,
    ArtQuery,
    ArtResponse,
    Autocomplete,
    AutoCompleteResponse,
    Dispatch,
    PieceData,
    PieceResponse,
    Source
} from './types';
import {error, GetArtAction, GetPieceAction, loaded, loading, SearchArtAction} from './actions';
import {HTTPAction} from './http/actions';
import {HTTPStatus} from './http/types';
import {http} from './http';
import {URI} from './URI';

export const apiBase = '/api/v1/artworks';
export const shapeOfResponse = ['id', 'title', 'image_id', 'artist_display', 'term_titles', 'thumbnail'];

export const data = {
    searchForArtOptions: (search: string, dispatch: Dispatch<SearchArtAction>): void => {
        dispatch(loading());
        http({
            url: URI.from({
                source: Source.AIC,
                path: '/search',
                params: {
                    'query[term][title]': search,
                    fields: 'suggest_autocomplete_all',
                    limit: 5
                }
            })
        }).then((action: HTTPAction<AutoCompleteResponse>) => {
            if (action.type === HTTPStatus.SUCCESS) {
                dispatch(loaded(action.value.data
                    .map(({suggest_autocomplete_all}: Autocomplete) => suggest_autocomplete_all[1])
                    .flatMap((option: ArtOption) => option.input)));
            }
        });
    },

    getAllArt: ({search, page, source}: ArtQuery, dispatch: Dispatch<GetArtAction>): void => {
        dispatch(loading());
        http({
                url: URI.from({source, params: {page, search, limit: 12}})
            }
        ).then((action: HTTPAction<ArtResponse>) => {
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
            url: URI.from({source: Source.AIC, path: `/${id}`})
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
