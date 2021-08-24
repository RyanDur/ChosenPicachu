import {
    AICArtResponse,
    AICPieceData,
    AICPieceResponse,
    ArtQuery,
    ArtResponse,
    AutocompleteResponse,
    Dispatch,
    HarvardArtResponse,
    Piece,
    PieceResponse,
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
        const sourced = toSource(query.source);
        http({
            url: URI.createSearchFrom(query.search, sourced)
        }).then((action: HTTPAction<AutocompleteResponse>) => {
            if (action.type === HTTPStatus.SUCCESS) {
                const options = sourced === Source.AIC ? action.value.data
                        .map(({suggest_autocomplete_all}) => suggest_autocomplete_all[1])
                        .flatMap(option => option.input) :
                    action.value.records.map(({title}) => title);
                dispatch(loaded(options));
            }
        });
    },

    getAllArt: ({search, page, source}: ArtQuery, dispatch: Dispatch<GetArtAction>): void => {
        dispatch(loading());
        http({
            url: URI.from({source, params: {page, search, limit: 12}})
        }).then((action: HTTPAction<ArtResponse>) => {
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
                        return dispatch(loaded(aicDataToPiece(action.value)));
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
    image: data.image_id ? `https://www.artic.edu/iiif/2/${data.image_id}/full/2000,/0/default.jpg` : undefined,
    artistInfo: data.artist_display,
    altText: data.thumbnail?.alt_text || data.term_titles.join(' ') || ''
});

const aicDataToPiece = ({data}: AICPieceData): Piece => aicToPiece(data);

const harvardToArt = ({info, records}: HarvardArtResponse) => ({
    pagination: {
        total: info.totalrecords,
        limit: info.totalrecordsperquery,
        offset: info.totalrecordsperquery * (info.page - 1),
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
