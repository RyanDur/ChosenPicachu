import {Source} from './types';
import {Decoder} from 'schemawax';
import {AICAllArtResponseDecoder, AICArtResponseDecoder, AICAutoCompleteResponseDecoder} from './types/AIC';
import {HarvardAllArtDecoder, HarvardArtDecoder, HarvardAutoCompleteDecoder} from './types/Harvard';
import {RIJKAllArtDecoder, RIJKArtDecoder} from './types/RIJK';

export const provideAllArtDecoder = (source: Source): Decoder<any> => {
    switch (source) {
        case Source.AIC:
            return AICAllArtResponseDecoder;
        case Source.HARVARD:
            return HarvardAllArtDecoder;
        default:
            return RIJKAllArtDecoder;
    }
};
export const provideArtDecoder = (source: Source): Decoder<any> => {
    switch (source) {
        case Source.AIC:
            return AICArtResponseDecoder;
        case Source.HARVARD:
            return HarvardArtDecoder;
        default:
            return RIJKArtDecoder;
    }
};
export const provideSearchDecoder = (source: Source): Decoder<any> => {
    switch (source) {
        case Source.AIC:
            return AICAutoCompleteResponseDecoder;
        case Source.HARVARD:
            return HarvardAutoCompleteDecoder;
        default:
            return RIJKArtDecoder;
    }
};