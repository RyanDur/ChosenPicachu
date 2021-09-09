import {
    AllArt,
    AllArtResponse,
    Art,
    ArtResponse,
    ArtSearchResponse,
    GetAllArt,
    GetArt,
    SearchArt,
    SearchOptions,
    Source
} from './types';
import {AICAllArtSchema, AICArtSchema, AICSearchSchema} from './aic/types';
import {HarvardAllArtSchema, HarvardArtSchema, HarvardSearchSchema} from './harvard/types';
import {RIJKAllArtSchema, RIJKArtSchema, RIJKSSearchSchema} from './rijks/types';
import {asyncResult, maybe, Result} from '@ryandur/sand';
import {aicArtToArt, aicSearchToSearch, aicToAllArt} from './aic';
import {harvardArtToArt, harvardToAllArt, harverdSearchToSearch} from './harvard';
import {rijkArtToArt, rijksSearchToSearch, rijkToAllArt} from './rijks';
import {ArtRequestError, error, GetAllArtAction, GetArtAction, loaded, loading, SearchArtAction} from './actions';
import {http} from '../http';
import {URI} from './URI';
import {Dispatch} from '../types';

const {success, failure} = asyncResult;

const searchForArt = (
    {search, source}: SearchArt,
    dispatch: Dispatch<SearchArtAction>
): void => {
    dispatch(loading());
    http({url: URI.createSearchFrom(search, source)})
        .flatMap((response: ArtSearchResponse): Result.Async<SearchOptions, any> => {
            switch (source) {
                case Source.AIC:
                    return maybe.of(AICSearchSchema.decode(response))
                        .map(verified => success<SearchOptions, ArtRequestError>(aicSearchToSearch(verified)))
                        .orElse(failure<SearchOptions, ArtRequestError>(ArtRequestError.CANNOT_DESERIALIZE));
                case Source.HARVARD:
                    return maybe.of(HarvardSearchSchema.decode(response))
                        .map(verified => success<SearchOptions, ArtRequestError>(harverdSearchToSearch(verified)))
                        .orElse(failure<SearchOptions, ArtRequestError>(ArtRequestError.CANNOT_DESERIALIZE));
                case Source.RIJKS:
                    return maybe.of(RIJKSSearchSchema.decode(response))
                        .map(verified => success<SearchOptions, ArtRequestError>(rijksSearchToSearch(verified)))
                        .orElse(failure<SearchOptions, ArtRequestError>(ArtRequestError.CANNOT_DESERIALIZE));
                default:
                    return failure<SearchOptions, ArtRequestError>(ArtRequestError.UNKNOWN_SOURCE);
            }
        })
        .onComplete(result => {
            if (result.isOk) dispatch(loaded(result.data));
            else dispatch(error(result.explanation));
        });
};

const getAllArt = (
    {page, size, source, search}: GetAllArt,
    dispatch: Dispatch<GetAllArtAction>
): void => {
    dispatch(loading());
    http({url: URI.from({source, params: {page, search, limit: size}})})
        .flatMap((response: AllArtResponse): Result.Async<AllArt, any> => {
            switch (source) {
                case Source.AIC:
                    return maybe.of(AICAllArtSchema.decode(response))
                        .map(verified => success<AllArt, ArtRequestError>(aicToAllArt(verified)))
                        .orElse(failure<AllArt, ArtRequestError>(ArtRequestError.CANNOT_DESERIALIZE));
                case Source.HARVARD:
                    return maybe.of(HarvardAllArtSchema.decode(response))
                        .map(verified => success<AllArt, ArtRequestError>(harvardToAllArt(verified)))
                        .orElse(failure<AllArt, ArtRequestError>(ArtRequestError.CANNOT_DESERIALIZE));
                case Source.RIJKS:
                    return maybe.of(RIJKAllArtSchema.decode(response))
                        .map(verified => success<AllArt, ArtRequestError>(rijkToAllArt(page, verified)))
                        .orElse(failure<AllArt, ArtRequestError>(ArtRequestError.CANNOT_DESERIALIZE));
                default:
                    return failure<AllArt, ArtRequestError>(ArtRequestError.UNKNOWN_SOURCE);
            }
        })
        .onComplete(result => {
            if (result.isOk) dispatch(loaded(result.data));
            else dispatch(error(result.explanation));
        });
};

const getArt = (
    {id, source}: GetArt,
    dispatch: Dispatch<GetArtAction>
): void => {
    dispatch(loading());
    http({url: URI.from({source: source, path: `/${id}`})})
        .flatMap((response: ArtResponse): Result.Async<Art, any> => {
            switch (source) {
                case Source.AIC:
                    return maybe.of(AICArtSchema.decode(response))
                        .map(verified => success<Art, ArtRequestError>(aicArtToArt(verified)))
                        .orElse(failure<Art, ArtRequestError>(ArtRequestError.CANNOT_DESERIALIZE));
                case Source.HARVARD:
                    return maybe.of(HarvardArtSchema.decode(response))
                        .map(verified => success<Art, ArtRequestError>(harvardArtToArt(verified)))
                        .orElse(failure<Art, ArtRequestError>(ArtRequestError.CANNOT_DESERIALIZE));
                case Source.RIJKS:
                    return maybe.of(RIJKArtSchema.decode(response))
                        .map(verified => success<Art, ArtRequestError>(rijkArtToArt(verified)))
                        .orElse(failure<Art, ArtRequestError>(ArtRequestError.CANNOT_DESERIALIZE));
                default:
                    return failure<Art, ArtRequestError>(ArtRequestError.UNKNOWN_SOURCE);
            }
        })
        .onComplete(result => {
            if (result.isOk) dispatch(loaded(result.data));
            else dispatch(error(result.explanation));
        });
};

export const artGallery = {
    getArt,
    getAllArt,
    searchForArt
};