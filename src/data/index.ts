import {
    AICArtResponse,
    AICPieceData,
    AICPieceResponse, Art,
    ArtQuery,
    ArtResponse,
    AutocompleteResponse,
    Dispatch,
    HarvardArtResponse,
    HarvardRecordResponse,
    Piece,
    PieceResponse,
    Source,
    toSource
} from './types';
import {error, GetArtAction, GetPieceAction, loaded, loading, SearchArtAction} from './actions';
import {HTTPAction} from './http/actions';
import {HTTPStatus} from './http/types';
import {http} from './http';
import {URI} from './URI';
import {RIJKAllArtResponse, RIJKArtObject, RIJKArtObjectResponse} from './types/RIJK';

export const data = {
    searchForArtOptions: ({search, source}: { search: string, source: string }, dispatch: Dispatch<SearchArtAction>): void => {
        dispatch(loading());
        http({
            url: URI.createSearchFrom(search, toSource(source))
        }).then((action: HTTPAction<AutocompleteResponse>) => {
            if (action.type === HTTPStatus.SUCCESS) {
                switch (source) {
                    case Source.AIC:
                        return dispatch(loaded(action.value.data
                            .map(({suggest_autocomplete_all}) => suggest_autocomplete_all[1])
                            .flatMap(option => option.input)));
                    case Source.HARVARD:
                        return dispatch(loaded(action.value.records.map(({title}) => title)));
                    default:
                        return dispatch(loaded(action.value.artObjects.map(({title}) => title)));
                }
            }
        });
    },

    getAllArt: ({page, size, source, search}: ArtQuery, dispatch: Dispatch<GetArtAction>): void => {
        dispatch(loading());
        http({
            url: URI.from({source, params: {page, search, limit: size}})
        }).then((action: HTTPAction<ArtResponse>) => {
            if (action.type === HTTPStatus.SUCCESS) {
                switch (source) {
                    case Source.AIC:
                        return dispatch(loaded(aicToArt(action.value)));
                    case Source.HARVARD:
                        return dispatch(loaded(harvardToArt(action.value)));
                    default:
                        return dispatch(loaded(rijkToArt(action.value, page)));
                }
            } else return dispatch(error());
        });
    },

    getPiece: ({id, source}: { id: string, source: string }, dispatch: Dispatch<GetPieceAction>): void => {
        dispatch(loading());
        http({
            url: URI.from({source: toSource(source), path: `/${id}`})
        }).then((action: HTTPAction<PieceResponse>) => {
            if (action.type === HTTPStatus.SUCCESS) {
                switch (source) {
                    case Source.AIC:
                        return dispatch(loaded(aicDataToPiece(action.value)));
                    case Source.HARVARD:
                        return dispatch(loaded(harvardToPiece(action.value)));
                    default:
                        return dispatch(loaded(toRijkToPiece(action.value)));
                }
            } else {
                console.log('failure');
                return dispatch(error());
            }
        });
    }
};

const aicToArt = ({pagination, data}: AICArtResponse): Art => ({
    pagination: {
        total: pagination.total,
        limit: pagination.limit,
        totalPages: pagination.total_pages,
        currentPage: pagination.current_page,
    },
    pieces: data.map(aicToPiece)
});

const aicToPiece = (data: AICPieceResponse): Piece => ({
    id: String(data.id),
    title: data.title,
    image: data.image_id ? `https://www.artic.edu/iiif/2/${data.image_id}/full/2000,/0/default.jpg` : undefined,
    artistInfo: data.artist_display,
    altText: data.thumbnail?.alt_text || data.term_titles.join(' ') || ''
});

const aicDataToPiece = ({data}: AICPieceData): Piece => aicToPiece(data);

const harvardToArt = ({info, records}: HarvardArtResponse): Art => ({
    pagination: {
        total: info.totalrecords,
        limit: info.totalrecordsperquery,
        totalPages: info.pages,
        currentPage: info.page,
    },
    pieces: records.map(harvardToPiece)
});

const harvardToPiece = (record: HarvardRecordResponse): Piece => ({
    id: String(record.id),
    title: record.title,
    image: record.primaryimageurl,
    artistInfo: record.people?.find(person => person.role === 'Artist')?.displayname || 'Unknown',
    altText: record.title
});

const rijkToArt = (data: RIJKAllArtResponse, page: number): Art => ({
    pagination: {
        total: data.count,
        limit: data.artObjects.length,
        totalPages: data.count / data.artObjects.length,
        currentPage: page,
    },
    pieces: data.artObjects.map(rijkToPiece)
});

const rijkToPiece = (data: RIJKArtObject): Piece => ({
    id: data.objectNumber,
    title: data.title,
    image: data.webImage.url,
    artistInfo: data.longTitle,
    altText: data.longTitle
});

const toRijkToPiece = ({artObject}: RIJKArtObjectResponse): Piece => rijkToPiece(artObject);
