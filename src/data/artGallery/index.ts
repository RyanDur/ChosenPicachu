import {AllArt, Art, GetAllArt, GetArt, SearchArt, SearchOptions, Source} from './types';
import {AICAllArtSchema, AICArtSchema, AICSearchSchema} from './aic/types';
import {HarvardAllArtSchema, HarvardArtSchema, HarvardSearchSchema} from './harvard/types';
import {RIJKAllArtSchema, RIJKArtSchema, RIJKSSearchSchema} from './rijks/types';
import {asyncEvent, asyncResult, OnAsyncEvent} from '@ryandur/sand';
import {aicArtToArt, aicSearchToSearch, aicToAllArt} from './aic';
import {harvardArtToArt, harvardToAllArt, harverdSearchToSearch} from './harvard';
import {rijkArtToArt, rijksSearchToSearch, rijkToAllArt} from './rijks';
import {http} from '../http';
import {URI} from './URI';
import {HTTPError} from '../types';

const {failure} = asyncResult;

export const artGallery = {
    getAllArt: ({page, size, source, search}: GetAllArt): OnAsyncEvent<AllArt, HTTPError> => {
        const url = URI.from({source, params: {page, search, limit: size}});
        switch (source) {
            case Source.AIC:
                return asyncEvent(http({
                    url,
                    schema: AICAllArtSchema
                }).map(aicToAllArt));
            case Source.HARVARD:
                return asyncEvent(http({
                    url,
                    schema: HarvardAllArtSchema
                }).map(harvardToAllArt));
            case Source.RIJKS:
                return asyncEvent(http({
                    url,
                    schema: RIJKAllArtSchema
                }).map(rijkToAllArt(page)));
            default:
                return asyncEvent(failure<AllArt, HTTPError>(HTTPError.UNKNOWN_SOURCE));
        }
    },

    getArt: ({id, source}: GetArt): OnAsyncEvent<Art, HTTPError> => {
        const url = URI.from({source: source, path: `/${id}`});
        switch (source) {
            case Source.AIC:
                return asyncEvent(http({
                    url,
                    schema: AICArtSchema
                }).map(aicArtToArt));
            case Source.HARVARD:
                return asyncEvent(http({
                    url,
                    schema: HarvardArtSchema
                }).map(harvardArtToArt));
            case Source.RIJKS:
                return asyncEvent(http({
                    url,
                    schema: RIJKArtSchema
                }).map(rijkArtToArt));
            default:
                return asyncEvent(failure<Art, HTTPError>(HTTPError.UNKNOWN_SOURCE));
        }
    },

    searchForArt: ({search, source}: SearchArt): OnAsyncEvent<SearchOptions, HTTPError> => {
        const url = URI.createSearchFrom(search, source);
        switch (source) {
            case Source.AIC:
                return asyncEvent(http({
                    url,
                    schema: AICSearchSchema
                }).map(aicSearchToSearch));
            case Source.HARVARD:
                return asyncEvent(http({
                    url,
                    schema: HarvardSearchSchema
                }).map(harverdSearchToSearch));
            case Source.RIJKS:
                return asyncEvent(http({
                    url,
                    schema: RIJKSSearchSchema
                }).map(rijksSearchToSearch));
            default:
                return asyncEvent(failure<SearchOptions, HTTPError>(HTTPError.UNKNOWN_SOURCE));
        }
    }
};