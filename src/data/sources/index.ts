import {Decoder} from 'schemawax';
import {Source} from './types';
import {AICAllArtResponseDecoder, AICArtResponseDecoder, AICAutoCompleteResponseDecoder} from './aic/types';
import {HarvardAllArtDecoder, HarvardArtDecoder, HarvardAutoCompleteDecoder} from './harvard/types';
import {RIJKAllArtDecoder, RIJKArtDecoder} from './rijks/types';

export const getAllArtSchemaFor = (source: Source): Decoder<any> => {
    switch (source) {
        case Source.AIC:
            return AICAllArtResponseDecoder;
        case Source.HARVARD:
            return HarvardAllArtDecoder;
        default:
            return RIJKAllArtDecoder;
    }
};
export const getArtSchemaFor = (source: Source): Decoder<any> => {
    switch (source) {
        case Source.AIC:
            return AICArtResponseDecoder;
        case Source.HARVARD:
            return HarvardArtDecoder;
        default:
            return RIJKArtDecoder;
    }
};
export const getSearchSchemaFor = (source: Source): Decoder<any> => {
    switch (source) {
        case Source.AIC:
            return AICAutoCompleteResponseDecoder;
        case Source.HARVARD:
            return HarvardAutoCompleteDecoder;
        default:
            return RIJKAllArtDecoder;
    }
};