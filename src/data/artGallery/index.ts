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
import {AICAllArtSchema, AICArtSchema, AICSearchSchema} from './aic/types';
import {HarvardAllArtSchema, HarvardArtSchema, HarvardSearchSchema} from './harvard/types';
import {RIJKAllArtSchema, RIJKSSearchSchema, RIJKArtSchema} from './rijks/types';
import {maybe, Maybe} from '@ryandur/sand';
import {aicArtToArt, aicSearchToSearch, aicToAllArt} from './aic';
import {harvardArtToArt, harvardToAllArt, harverdSearchToSearch} from './harvard';
import {rijkArtToArt, rijksSearchToSearch, rijkToAllArt} from './rijks';
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
                    return maybe.of(AICSearchSchema.decode(response)).map(aicSearchToSearch);
                case Source.HARVARD:
                    return maybe.of(HarvardSearchSchema.decode(response)).map(harverdSearchToSearch);
                case Source.RIJKS:
                    return maybe.of(RIJKSSearchSchema.decode(response)).map(rijksSearchToSearch);
                default:
                    return maybe.none();
            }
        })
        .map(options => options.map<SearchArtAction>(loaded).orElse(error()))
        .onSuccess(dispatch);
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
                    return maybe.of(AICAllArtSchema.decode(response)).map(aicToAllArt);
                case Source.HARVARD:
                    return maybe.of(HarvardAllArtSchema.decode(response)).map(harvardToAllArt);
                case Source.RIJKS:
                    return maybe.of(RIJKAllArtSchema.decode(response)).map(rijkToAllArt(page));
                default:
                    return maybe.none();
            }
        })
        .map(allArt => allArt.map<GetAllArtAction>(loaded).orElse(error()))
        .onSuccess(dispatch);
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
                    return maybe.of(AICArtSchema.decode(response)).map(aicArtToArt);
                case Source.HARVARD:
                    return maybe.of(HarvardArtSchema.decode(response)).map(harvardArtToArt);
                case Source.RIJKS:
                    return maybe.of(RIJKArtSchema.decode(response)).map(rijkArtToArt);
                default:
                    return maybe.none();
            }
        })
        .map(art => art.map<GetArtAction>(loaded).orElse(error()))
        .onSuccess(dispatch);
};

export const artGallery = {
    getArt,
    getAllArt,
    searchForArt
};