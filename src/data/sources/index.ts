import {AllArtResponse, AllArt, ArtResponse, Art, SearchOptions, SearchResponse, Source} from './types';
import {AICAllArtResponseDecoder, AICArtResponseDecoder, AICSearchResponseDecoder} from './aic/types';
import {HarvardAllArtDecoder, HarvardArtDecoder, HarvardSearchDecoder} from './harvard/types';
import {RIJKAllArtDecoder, RIJKArtDecoder} from './rijks/types';
import {maybe, Maybe} from '@ryandur/sand';
import {aicSearchToOptions, aicArtToPiece, aicToArt} from './aic';
import {harvardToArt, harvardArtToPiece, harverdSearchToOptions} from './harvard';
import {rijksSearchToOptions, rijkToArt, rijkArtObjectToPiece} from './rijks';

export const translateAllArtResponseFor = (source: Source, page: number) => (response: AllArtResponse): Maybe<AllArt> => {
    switch (source) {
        case Source.AIC:
            return maybe.of(AICAllArtResponseDecoder.decode(response))
                .map(aicToArt);
        case Source.HARVARD:
            return maybe.of(HarvardAllArtDecoder.decode(response))
                .map(harvardToArt);
        case Source.RIJK:
            return maybe.of(RIJKAllArtDecoder.decode(response))
                .map(rijkToArt(page));
        default:
            return maybe.none();
    }
};

export const translateArtResponseFor = (source: Source) => (response: ArtResponse): Maybe<Art> => {
    switch (source) {
        case Source.AIC:
            return maybe.of(AICArtResponseDecoder.decode(response))
                .map(aicArtToPiece);
        case Source.HARVARD:
            return maybe.of(HarvardArtDecoder.decode(response))
                .map(harvardArtToPiece);
        case Source.RIJK:
            return maybe.of(RIJKArtDecoder.decode(response))
                .map(rijkArtObjectToPiece);
        default:
            return maybe.none();
    }
};

export const translateSearchResponseFor = (source: Source) => (response: SearchResponse): Maybe<SearchOptions> => {
    switch (source) {
        case Source.AIC:
            return maybe.of(AICSearchResponseDecoder.decode(response))
                .map(aicSearchToOptions);
        case Source.HARVARD:
            return maybe.of(HarvardSearchDecoder.decode(response))
                .map(harverdSearchToOptions);
        case Source.RIJK:
            return maybe.of(RIJKAllArtDecoder.decode(response))
                .map(rijksSearchToOptions);
        default:
            return maybe.none();
    }
};