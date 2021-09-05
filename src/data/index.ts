import {AutocompleteResponse, Dispatch, Source} from './types';
import {error, GetArtAction, GetPieceAction, loaded, loading, SearchArtAction} from './actions';
import {aicDataToPiece, aicToArt, harvardToArt, harvardToPiece, rijkToArt, toRijkToPiece} from './translators';
import {provideAllArtDecoder, provideArtDecoder, provideSearchDecoder} from './decoders';
import {http} from './http';
import {URI} from './URI';
import {maybe} from '@ryandur/sand';

interface SearchArt {
    search: string;
    source: Source;
}

interface GetAllArt {
    search?: string;
    page: number;
    size: number;
    source: Source;
}

interface GetArt {
    id: string;
    source: Source;
}

export const data = {
    searchForArtOptions: (
        {search, source}: SearchArt,
        dispatch: Dispatch<SearchArtAction>
    ): void => {
        dispatch(loading());
        http({url: URI.createSearchFrom(search, source)})
            .onFailure(() => dispatch(error()))
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
            .onSuccess(dispatch);
    },

    getAllArt: (
        {page, size, source, search}: GetAllArt,
        dispatch: Dispatch<GetArtAction>
    ): void => {
        dispatch(loading());
        http({url: URI.from({source, params: {page, search, limit: size}})})
            .onFailure(() => dispatch(error()))
            .map(result => maybe.of(provideAllArtDecoder(source)
                .decode(result.orNull()))
                .map(response => {
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
            .onSuccess(dispatch);
    },

    getPiece: (
        {id, source}: GetArt,
        dispatch: Dispatch<GetPieceAction>
    ): void => {
        dispatch(loading());
        http({url: URI.from({source: source, path: `/${id}`})})
            .onFailure(() => dispatch(error()))
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
            .onSuccess(dispatch);
    }
};
