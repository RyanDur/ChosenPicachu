import {Dispatch, GetAllArt, GetArt, SearchArt} from './types';
import {error, GetAllArtAction, GetArtAction, loaded, loading, SearchArtAction} from './actions';
import {translateAllArtResponseFor, translateArtResponseFor, translateSearchResponseFor} from './sources';
import {http} from './http';
import {URI} from './URI';

export const data = {
    searchForArtOptions: (
        {search, source}: SearchArt,
        dispatch: Dispatch<SearchArtAction>
    ): void => {
        dispatch(loading());
        http({url: URI.createSearchFrom(search, source)})
            .onFailure(() => dispatch(error()))
            .map(translateSearchResponseFor(source))
            .onSuccess(search =>
                dispatch(search.map<SearchArtAction>(loaded).orElse(error())));
    },

    getAllArt: (
        {page, size, source, search}: GetAllArt,
        dispatch: Dispatch<GetAllArtAction>
    ): void => {
        dispatch(loading());
        http({url: URI.from({source, params: {page, search, limit: size}})})
            .onFailure(() => dispatch(error()))
            .map(translateAllArtResponseFor(source, page))
            .onSuccess(allArt =>
                dispatch(allArt.map<GetAllArtAction>(loaded).orElse(error())));
    },

    getPiece: (
        {id, source}: GetArt,
        dispatch: Dispatch<GetArtAction>
    ): void => {
        dispatch(loading());
        http({url: URI.from({source: source, path: `/${id}`})})
            .onFailure(() => dispatch(error()))
            .map(translateArtResponseFor(source))
            .onSuccess(art =>
                dispatch(art.map<GetArtAction>(loaded).orElse(error())));
    }
};
