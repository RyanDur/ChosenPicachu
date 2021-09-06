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
import {AICAllArtResponseDecoder, AICArtResponseDecoder, AICSearchResponseDecoder} from './aic/types';
import {HarvardAllArtDecoder, HarvardArtDecoder, HarvardSearchDecoder} from './harvard/types';
import {RIJKAllArtDecoder, RIJKArtDecoder} from './rijks/types';
import {maybe, Maybe} from '@ryandur/sand';
import {aicArtToPiece, aicSearchToOptions, aicToArt} from './aic';
import {harvardArtToPiece, harvardToArt, harverdSearchToOptions} from './harvard';
import {rijkArtObjectToPiece, rijksSearchToOptions, rijkToArt} from './rijks';
import {Dispatch} from '../types';
import {error, GetAllArtAction, GetArtAction, loaded, loading, SearchArtAction} from './actions';
import {http} from '../http';
import {URI} from './URI';

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
                    return maybe.of(AICSearchResponseDecoder.decode(response)).map(aicSearchToOptions);
                case Source.HARVARD:
                    return maybe.of(HarvardSearchDecoder.decode(response)).map(harverdSearchToOptions);
                case Source.RIJKS:
                    return maybe.of(RIJKAllArtDecoder.decode(response)).map(rijksSearchToOptions);
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
                    return maybe.of(AICAllArtResponseDecoder.decode(response)).map(aicToArt);
                case Source.HARVARD:
                    return maybe.of(HarvardAllArtDecoder.decode(response)).map(harvardToArt);
                case Source.RIJKS:
                    return maybe.of(RIJKAllArtDecoder.decode(response)).map(rijkToArt(page));
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
                    return maybe.of(AICArtResponseDecoder.decode(response)).map(aicArtToPiece);
                case Source.HARVARD:
                    return maybe.of(HarvardArtDecoder.decode(response)).map(harvardArtToPiece);
                case Source.RIJKS:
                    return maybe.of(RIJKArtDecoder.decode(response)).map(rijkArtObjectToPiece);
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