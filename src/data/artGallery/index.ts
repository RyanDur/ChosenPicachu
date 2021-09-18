import {AllArt, Art, GetAllArt, GetArt, SearchArt, SearchOptions, Source} from './types';
import {AICAllArtSchema, AICArtSchema, AICSearchSchema} from './aic/types';
import {HarvardAllArtSchema, HarvardArtSchema, HarvardSearchSchema} from './harvard/types';
import {RIJKAllArtSchema, RIJKArtSchema, RIJKSSearchSchema} from './rijks/types';
import {asyncEvent, asyncResult, OnAsyncEvent} from '@ryandur/sand';
import {aicArtToArt, aicSearchToSearch, aicToAllArt} from './aic';
import {harvardArtToArt, harvardToAllArt, harverdSearchToSearch} from './harvard';
import {rijkArtToArt, rijksSearchToSearch, rijkToAllArt} from './rijks';
import {http, validate} from '../http';
import {URI} from './URI';
import {HTTPError} from '../types';

const unknownSource = <T>() => asyncResult.failure<T, HTTPError>(HTTPError.UNKNOWN_SOURCE);

export const artGallery = {
    getAllArt: ({page, size, source, search}: GetAllArt): OnAsyncEvent<AllArt, HTTPError> =>
        asyncEvent(http.get(URI.from({source, params: {page, search, limit: size}}))
            .flatMap(response => {
                switch (source) {
                    case Source.AIC:
                        return validate(AICAllArtSchema, response).map(aicToAllArt);
                    case Source.HARVARD:
                        return validate(HarvardAllArtSchema, response).map(harvardToAllArt);
                    case Source.RIJKS:
                        return validate(RIJKAllArtSchema, response).map(rijkToAllArt(page));
                    default:
                        return unknownSource();
                }
            })),

    getArt: ({id, source}: GetArt): OnAsyncEvent<Art, HTTPError> =>
        asyncEvent(http.get(URI.from({source: source, path: `/${id}`}))
            .flatMap(response => {
                switch (source) {
                    case Source.AIC:
                        return validate(AICArtSchema, response).map(aicArtToArt);
                    case Source.HARVARD:
                        return validate(HarvardArtSchema, response).map(harvardArtToArt);
                    case Source.RIJKS:
                        return validate(RIJKArtSchema, response).map(rijkArtToArt);
                    default:
                        return unknownSource();
                }
            })),

    searchForArt: ({search, source}: SearchArt): OnAsyncEvent<SearchOptions, HTTPError> =>
        asyncEvent(http.get(URI.createSearchFrom(search, source))
            .flatMap(response => {
                switch (source) {
                    case Source.AIC:
                        return validate(AICSearchSchema, response).map(aicSearchToSearch);
                    case Source.HARVARD:
                        return validate(HarvardSearchSchema, response).map(harverdSearchToSearch);
                    case Source.RIJKS:
                        return validate(RIJKSSearchSchema, response).map(rijksSearchToSearch);
                    default:
                        return unknownSource();
                }
            }))
};