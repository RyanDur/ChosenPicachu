import {AllArtResponse, ArtQuery, AutocompleteResponse, Dispatch, PieceResponse, Source, toSource} from './types';
import {error, GetArtAction, GetPieceAction, loaded, loading, SearchArtAction} from './actions';
import {HTTPAction} from './http/actions';
import {HTTPStatus} from './http/types';
import {http} from './http';
import {URI} from './URI';
import {aicDataToPiece, aicToArt, harvardToArt, harvardToPiece, rijkToArt, toRijkToPiece} from './translators';
import {provideAllArtDecoder, provideArtDecoder, provideSearchDecoder} from './decoders';

export const data = {
    searchForArtOptions: ({
        search,
        source
    }: { search: string, source: string }, dispatch: Dispatch<SearchArtAction>): void => {
        dispatch(loading());
        http({
            url: URI.createSearchFrom(search, toSource(source)),
            decoder: provideSearchDecoder(toSource(source))
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
            url: URI.from({source, params: {page, search, limit: size}}),
            decoder: provideAllArtDecoder(source)
        }).then((action: HTTPAction<AllArtResponse>) => {
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
            url: URI.from({source: toSource(source), path: `/${id}`}),
            decoder: provideArtDecoder(toSource(source))
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
            } else return dispatch(error());
        });
    }
};
