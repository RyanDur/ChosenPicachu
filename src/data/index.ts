import {
    AICArtOption,
    AICArtResponse,
    AICAutocomplete,
    AICAutoCompleteResponse, AICPieceData,
    AICPieceResponse,
    ArtQuery,
    Dispatch, Piece,
    toSource
} from './types';
import {error, GetArtAction, GetPieceAction, loaded, loading, SearchArtAction} from './actions';
import {HTTPAction} from './http/actions';
import {HTTPStatus} from './http/types';
import {http} from './http';
import {URI} from './URI';

export const apiBase = '/api/v1/artworks';
export const shapeOfResponse = ['id', 'title', 'image_id', 'artist_display', 'term_titles', 'thumbnail'];

export const data = {
    searchForArtOptions: (query: { search: string, source: string }, dispatch: Dispatch<SearchArtAction>): void => {
        dispatch(loading());
        http({
            url: URI.from({
                source: toSource(query.source),
                path: '/search',
                params: {
                    'query[term][title]': query.search,
                    fields: 'suggest_autocomplete_all',
                    limit: 5
                }
            })
        }).then((action: HTTPAction<AICAutoCompleteResponse>) => {
            if (action.type === HTTPStatus.SUCCESS) {
                dispatch(loaded(action.value.data
                    .map(({suggest_autocomplete_all}: AICAutocomplete) => suggest_autocomplete_all[1])
                    .flatMap((option: AICArtOption) => option.input)));
            }
        });
    },

    getAllArt: ({search, page, source}: ArtQuery, dispatch: Dispatch<GetArtAction>): void => {
        dispatch(loading());
        http({
                url: URI.from({source, params: {page, search, limit: 12}})
            }
        ).then((action: HTTPAction<AICArtResponse>) => {
            switch (action.type) {
                case HTTPStatus.FAILURE:
                    return dispatch(error());
                case HTTPStatus.SUCCESS:
                    return dispatch(loaded(toArt(action.value)));
            }
        });
    },

    getPiece: ({id, source}: { id: string, source: string }, dispatch: Dispatch<GetPieceAction>): void => {
        dispatch(loading());
        http({
            url: URI.from({source: toSource(source), path: `/${id}`})

        }).then((action: HTTPAction<AICPieceData>) => {
            switch (action.type) {
                case HTTPStatus.FAILURE:
                    return dispatch(error());
                case HTTPStatus.SUCCESS:
                    return dispatch(loaded(toPiece(action.value.data)));
            }
        });
    }
};

const toArt = ({pagination, data}: AICArtResponse) => ({
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

const toPiece = (data: AICPieceResponse): Piece => ({
    id: data.id,
    title: data.title,
    image: `https://www.artic.edu/iiif/2/${data.image_id}/full/2000,/0/default.jpg`,
    artistInfo: data.artist_display,
    altText: data.thumbnail?.alt_text || data.term_titles.join(' ') || ''
});
