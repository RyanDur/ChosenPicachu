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
import {RIJKAllArt, RIJKPiece} from './RIJK';
import {Art, Piece} from './Art';
import {HarvardAllArt, HarvardAutoCompleteResponse, HarvardPiece} from './Harvard';

export type AllArtResponse = AICAllArt & HarvardAllArt & RIJKAllArt
export type PieceResponse = AICPieceData & AICArt & HarvardPiece & RIJKPiece
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


export type AutocompleteResponse = AICAutoCompleteResponse & HarvardAutoCompleteResponse & RIJKAllArt

export interface Action<T> {
    type: T;
}

export type Dispatch<T> = Consumer<T>;
