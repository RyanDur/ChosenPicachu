import {Consumer} from '../../components/UserInfo/types';
import {Source, toSource} from './Source';
import {
    AICAllArt,
    AICArt,
    AICArtOption,
    AICArtSuggestion,
    AICAutocomplete,
    AICAutoCompleteResponse,
    AICPieceData
} from './AIC';

import {AsyncState, Error, Loaded, Loading} from './AsyncState';
import {Art, Piece} from './Art';
import {HarvardAllArt, HarvardPiece} from './Harvard';

export type {
    AICArtOption,
    AICAllArt,
    AICAutocomplete,
    AICAutoCompleteResponse,
    AICPieceData,
    AICArt,
    AICArtSuggestion,

    HarvardAllArt,
    HarvardPiece,

    Art,
    Piece,

    Loaded,
    Loading,
    Error
};

export {
    Source,
    toSource,
    AsyncState
};

export interface Action<T> {
    type: T;
}

export type Dispatch<T> = Consumer<T>;
