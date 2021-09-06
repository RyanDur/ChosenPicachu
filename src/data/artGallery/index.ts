import {
    AllArt,
    AllArtResponse,
    Art,
    ArtResponse,
    GetAllArt,
    GetArt,
    SearchArt,
    SearchOptions,
    SearchResponse,
    Source
} from './types';
import {AICAllArtResponseSchema, AICArtResponseSchema, AICSearchResponseSchema} from './aic/types';
import {HarvardAllArtSchema, HarvardArtSchema, HarvardSearchSchema} from './harvard/types';
import {RIJKAllArtSchema, RIJKSearchOptions, RIJKArtSchema} from './rijks/types';
import {maybe, Maybe} from '@ryandur/sand';
import {aicArtToArt, aicSearchToOptions, aicToAllArt} from './aic';
import {harvardArtToArt, harvardToAllArt, harverdSearchToOptions} from './harvard';
import {rijkArtToArt, rijksSearchToOptions, rijkToAllArt} from './rijks';
import {error, GetAllArtAction, GetArtAction, loaded, loading, SearchArtAction} from './actions';
import {http} from '../http';
import {URI} from './URI';
import {Dispatch} from '../types';

const searchForArt = (
    {search, source}: SearchArt,
    dispatch: Dispatch<SearchArtAction>
): void => {
    dispatch(loading());
    http({url: URI.createSearchFrom(search, source)})
        .onFailure(() => dispatch(error()))
        .map((response: SearchResponse): Maybe<SearchOptions> => {
            switch (source) {
                case Source.AIC:
                    return maybe.of(AICSearchResponseSchema.decode(response)).map(aicSearchToOptions);
                case Source.HARVARD:
                    return maybe.of(HarvardSearchSchema.decode(response)).map(harverdSearchToOptions);
                case Source.RIJKS:
                    return maybe.of(RIJKSearchOptions.decode(response)).map(rijksSearchToOptions);
                default:
                    return maybe.none();
            }
        })
        .onSuccess(search =>
            dispatch(search.map<SearchArtAction>(loaded).orElse(error())));
};

const getAllArt = (
    {page, size, source, search}: GetAllArt,
    dispatch: Dispatch<GetAllArtAction>
): void => {
    dispatch(loading());
    http({url: URI.from({source, params: {page, search, limit: size}})})
        .onFailure(() => dispatch(error()))
        .map((response: AllArtResponse): Maybe<AllArt> => {
            switch (source) {
                case Source.AIC:
                    return maybe.of(AICAllArtResponseSchema.decode(response)).map(aicToAllArt);
                case Source.HARVARD:
                    return maybe.of(HarvardAllArtSchema.decode(response)).map(harvardToAllArt);
                case Source.RIJKS:
                    return maybe.of(RIJKAllArtSchema.decode(response)).map(rijkToAllArt(page));
                default:
                    return maybe.none();
            }
        })
        .onSuccess(allArt =>
            dispatch(allArt.map<GetAllArtAction>(loaded).orElse(error())));
};

const getArt = (
    {id, source}: GetArt,
    dispatch: Dispatch<GetArtAction>
): void => {
    dispatch(loading());
    http({url: URI.from({source: source, path: `/${id}`})})
        .onFailure(() => dispatch(error()))
        .map((response: ArtResponse): Maybe<Art> => {
            switch (source) {
                case Source.AIC:
                    return maybe.of(AICArtResponseSchema.decode(response)).map(aicArtToArt);
                case Source.HARVARD:
                    return maybe.of(HarvardArtSchema.decode(response)).map(harvardArtToArt);
                case Source.RIJKS:
                    return maybe.of(RIJKArtSchema.decode(response)).map(rijkArtToArt);
                default:
                    return maybe.none();
            }
        })
        .onSuccess(art =>
            dispatch(art.map<GetArtAction>(loaded).orElse(error())));
};

export const artGallery = {
    getArt,
    getAllArt,
    searchForArt
};