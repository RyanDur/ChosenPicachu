import {Dispatch} from './types';
import {error, GetArtAction, GetPieceAction, loaded, loading, SearchArtAction} from './actions';
import {aicAutocompleteToOptions, aicDataToPiece, aicToArt} from './sources/aic';
import {harvardToArt, harvardToPiece, harverdAutocompleteToOptions} from './sources/harvard';
import {rijksAutocompleteToOptions, rijkToArt, toRijkToPiece} from './sources/rijks';
import {allArtSchema, artSchema, searchSchema} from './sources';
import {Source} from './sources/types';
import {maybe} from '@ryandur/sand';
import {http} from './sources/http';
import {URI} from './URI';

export interface SearchArt {
    search: string;
    source: Source;
}

export interface GetAllArt {
    search?: string;
    page: number;
    size: number;
    source: Source;
}

export interface GetArt {
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
            .map(result => maybe.of(searchSchema(source).decode(result.orNull()))
                .map(response => {
                    switch (source) {
                        case Source.AIC:
                            return loaded(aicAutocompleteToOptions(response));
                        case Source.HARVARD:
                            return loaded(harverdAutocompleteToOptions(response));
                        case Source.RIJK:
                            return loaded(rijksAutocompleteToOptions(response));
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
            .map(result => maybe.of(allArtSchema(source).decode(result.orNull()))
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
            .map(result => maybe.of(artSchema(source).decode(result.orNull()))
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
