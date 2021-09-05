import {AllArtResponse, AutocompleteResponse, Dispatch, Source} from './types';
import {error, GetArtAction, GetPieceAction, loaded, loading, SearchArtAction} from './actions';
import {aicDataToPiece, aicToArt, harvardToArt, harvardToPiece, rijkToArt, toRijkToPiece} from './translators';
import {provideAllArtDecoder, provideArtDecoder, provideSearchDecoder} from './decoders';
import {http} from './http';
import {URI} from './URI';
import {maybe} from '@ryandur/sand';

export const data = {
    searchForArtOptions: ({
        search,
        source
    }: { search: string, source: Source }, dispatch: Dispatch<SearchArtAction>): void => {
        dispatch(loading());
        http({url: URI.createSearchFrom(search, source)})
            .mapFailure(error)
            .map(result => maybe.of(provideSearchDecoder(source)
                .decode(result.orNull()))
                .map((response: AutocompleteResponse) => {
                    switch (source) {
                        case Source.AIC:
                            return loaded(response.data
                                .map(({suggest_autocomplete_all}) => suggest_autocomplete_all[1])
                                .flatMap(option => option.input));
                        case Source.HARVARD:
                            return loaded(response.records.map(({title}) => title));
                        case Source.RIJK:
                            return loaded(response.artObjects.map(({title}) => title));
                        default:
                            return error();
                    }
                }).orElse(error()))
            .onComplete(result => result.map(dispatch));
    },

    getAllArt: ({
        page,
        size,
        source,
        search
    }: { search?: string; page: number; size: number; source: Source; }, dispatch: Dispatch<GetArtAction>): void => {
        dispatch(loading());
        http({
            url: URI.from({source, params: {page, search, limit: size}}),
        }).mapFailure(error)
            .map(result => maybe.of(provideAllArtDecoder(source)
                .decode(result.orNull()))
                .map((response: AllArtResponse) => {
                    switch (source) {
                        case Source.AIC:
                            return loaded(aicToArt(response));
                        case Source.HARVARD:
                            return loaded(harvardToArt(response));
                        case Source.RIJK:
                            return loaded(rijkToArt(response, page));
                        default:
                            return error();
                    }
                }).orElse(error()))
            .onComplete(result => result.map(dispatch));
    },

    getPiece: ({
        id,
        source
    }: { id: string, source: Source }, dispatch: Dispatch<GetPieceAction>): void => {
        dispatch(loading());
        http({
            url: URI.from({source: source, path: `/${id}`}),
        }).mapFailure(() => dispatch(error()))
            .map(result => maybe.of(provideArtDecoder(source)
                .decode(result.orNull()))
                .map(response => {
                    switch (source) {
                        case Source.AIC:
                            return loaded(aicDataToPiece(response));
                        case Source.HARVARD:
                            return loaded(harvardToPiece(response));
                        case Source.RIJK:
                            return loaded(toRijkToPiece(response));
                        default:
                            return error();
                    }
                }).orElse(error()))
            .onComplete(result => result.map(dispatch));
    }
};
