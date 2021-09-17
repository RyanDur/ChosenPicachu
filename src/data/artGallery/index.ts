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
import {asyncEvent, asyncResult, maybe, OnEvent} from '@ryandur/sand';
import {aicArtToArt, aicSearchToSearch, aicToAllArt} from './aic';
import {harvardArtToArt, harvardToAllArt, harverdSearchToSearch} from './harvard';
import {rijkArtToArt, rijksSearchToSearch, rijkToAllArt} from './rijks';
import {http} from '../http';
import {URI} from './URI';
import {HTTPError} from '../types';
const {success, failure} = asyncResult;

export const artGallery = {
    getAllArt: ({page, size, source, search}: GetAllArt): OnEvent<AllArt, HTTPError> =>
        asyncEvent(http({url: URI.from({source, params: {page, search, limit: size}})})
            .flatMap((response: AllArtResponse) => {
                switch (source) {
                    case Source.AIC:
                        return maybe.of(AICAllArtSchema.decode(response))
                            .map(verified => success<AllArt, HTTPError>(aicToAllArt(verified)))
                            .orElse(failure<AllArt, HTTPError>(HTTPError.CANNOT_DESERIALIZE));
                    case Source.HARVARD:
                        return maybe.of(HarvardAllArtSchema.decode(response))
                            .map(verified => success<AllArt, HTTPError>(harvardToAllArt(verified)))
                            .orElse(failure<AllArt, HTTPError>(HTTPError.CANNOT_DESERIALIZE));
                    case Source.RIJKS:
                        return maybe.of(RIJKAllArtSchema.decode(response))
                            .map(verified => success<AllArt, HTTPError>(rijkToAllArt(page, verified)))
                            .orElse(failure<AllArt, HTTPError>(HTTPError.CANNOT_DESERIALIZE));
                    default:
                        return failure<AllArt, HTTPError>(HTTPError.UNKNOWN_SOURCE);
                }
            })),

    getArt: ({id, source}: GetArt): OnEvent<Art, HTTPError> =>
        asyncEvent(http({url: URI.from({source: source, path: `/${id}`})})
            .flatMap((response: ArtResponse) => {
                switch (source) {
                    case Source.AIC:
                        return maybe.of(AICArtSchema.decode(response))
                            .map(verified => success<Art, HTTPError>(aicArtToArt(verified)))
                            .orElse(failure<Art, HTTPError>(HTTPError.CANNOT_DESERIALIZE));
                    case Source.HARVARD:
                        return maybe.of(HarvardArtSchema.decode(response))
                            .map(verified => success<Art, HTTPError>(harvardArtToArt(verified)))
                            .orElse(failure<Art, HTTPError>(HTTPError.CANNOT_DESERIALIZE));
                    case Source.RIJKS:
                        return maybe.of(RIJKArtSchema.decode(response))
                            .map(verified => success<Art, HTTPError>(rijkArtToArt(verified)))
                            .orElse(failure<Art, HTTPError>(HTTPError.CANNOT_DESERIALIZE));
                    default:
                        return failure<Art, HTTPError>(HTTPError.UNKNOWN_SOURCE);
                }
            })),

    searchForArt: ({search, source}: SearchArt): OnEvent<SearchOptions, HTTPError> =>
        asyncEvent(http({url: URI.createSearchFrom(search, source)})
            .flatMap((response: ArtSearchResponse) => {
                switch (source) {
                    case Source.AIC:
                        return maybe.of(AICSearchSchema.decode(response))
                            .map(verified => success<SearchOptions, HTTPError>(aicSearchToSearch(verified)))
                            .orElse(failure<SearchOptions, HTTPError>(HTTPError.CANNOT_DESERIALIZE));
                    case Source.HARVARD:
                        return maybe.of(HarvardSearchSchema.decode(response))
                            .map(verified => success<SearchOptions, HTTPError>(harverdSearchToSearch(verified)))
                            .orElse(failure<SearchOptions, HTTPError>(HTTPError.CANNOT_DESERIALIZE));
                    case Source.RIJKS:
                        return maybe.of(RIJKSSearchSchema.decode(response))
                            .map(verified => success<SearchOptions, HTTPError>(rijksSearchToSearch(verified)))
                            .orElse(failure<SearchOptions, HTTPError>(HTTPError.CANNOT_DESERIALIZE));
                    default:
                        return failure<SearchOptions, HTTPError>(HTTPError.UNKNOWN_SOURCE);
                }
            }))
};