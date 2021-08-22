import {
    AICArtOption,
    AICArtResponse,
    AICAutocomplete,
    AICAutoCompleteResponse,
    AICPieceResponse,
    ArtQuery,
    ArtResponse,
    Dispatch,
    HarvardArtResponse,
    Piece, PieceResponse,
    RecordResponse,
    Source,
    toSource
} from './types';
import {error, GetArtAction, GetPieceAction, loaded, loading, SearchArtAction} from './actions';
import {HTTPAction} from './http/actions';
import {HTTPStatus} from './http/types';
import {http} from './http';
import {URI} from './URI';

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
        ).then((action: HTTPAction<ArtResponse>) => {
            switch (action.type) {
                case HTTPStatus.FAILURE:
                    return dispatch(error());
                case HTTPStatus.SUCCESS: {
                    if (source === Source.AIC) {
                        return dispatch(loaded(aicToArt(action.value)));
                    } else {
                        return dispatch(loaded(harvardToArt(action.value)));
                    }
                }
            }
        });
    },

    getPiece: ({id, source}: { id: string, source: string }, dispatch: Dispatch<GetPieceAction>): void => {
        dispatch(loading());
        const aSource = toSource(source);
        http({
            url: URI.from({source: aSource, path: `/${id}`})
        }).then((action: HTTPAction<PieceResponse>) => {
            switch (action.type) {
                case HTTPStatus.FAILURE:
                    return dispatch(error());
                case HTTPStatus.SUCCESS: {
                    if (source === Source.AIC) {
                        return dispatch(loaded(aicToPiece(action.value)));
                    } else {
                        return dispatch(loaded(harvardToPiece(action.value)));
                    }
                }
            }
        });
    }
};

const aicToArt = ({pagination, data}: AICArtResponse) => ({
    pagination: {
        total: pagination.total,
        limit: pagination.limit,
        offset: pagination.offset,
        totalPages: pagination.total_pages,
        currentPage: pagination.current_page,
        nextUrl: pagination.next_url
    },
    pieces: data.map(aicToPiece)
});

const aicToPiece = (data: AICPieceResponse): Piece => ({
    id: data.id,
    title: data.title,
    image: `https://www.artic.edu/iiif/2/${data.image_id}/full/2000,/0/default.jpg`,
    artistInfo: data.artist_display,
    altText: data.thumbnail?.alt_text || data.term_titles.join(' ') || ''
});

const harvardToArt = ({info, records}: HarvardArtResponse) => ({
    pagination: {
        total: info.totalrecords,
        limit: info.totalrecordsperquery,
        offset: info.totalrecordsperquery * (info.page -1),
        totalPages: info.pages,
        currentPage: info.page,
        nextUrl: info.next
    },
    pieces: records.map(harvardToPiece)
});

const harvardToPiece = (record: RecordResponse): Piece => ({
    id: record.id,
    title: record.title,
    image: record.primaryimageurl,
    artistInfo: record.people?.find(person => person.role === 'Artist')?.displayname || 'Unknown',
    altText: record.title
});
