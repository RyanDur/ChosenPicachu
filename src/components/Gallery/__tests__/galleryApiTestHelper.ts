import {AICAllArtResponse, AICArtResponse} from "../resource/aic/types";
import {aicDomain, defaultRecordLimit, harvardAPIKey, harvardDomain, rijksAPIKey, rijksDomain} from "../../../config";
import {fields} from "../resource/aic";
import {HarvardAllArtResponse} from "../resource/harvard/types";
import {harvardFields} from "../resource/harvard";
import {RIJKSAllArtResponse} from "../resource/rijks/types";

export const setupAICAllArtResponse = (response: AICAllArtResponse, limit = defaultRecordLimit) =>
    fetchMock.mockOnceIf(`${aicDomain}/?fields=${fields.join()}&limit=${limit}`,
        () => Promise.resolve(JSON.stringify(response)));

export const setupHarvardAllArtResponse = (response: HarvardAllArtResponse, limit = defaultRecordLimit) =>
    fetchMock.mockOnceIf(`${harvardDomain}/?page=1&size=${limit}&fields=${harvardFields}&apikey=${harvardAPIKey}`,
        () => Promise.resolve(JSON.stringify(response)));

export const setupRijksAllArtResponse = (response: RIJKSAllArtResponse, limit = defaultRecordLimit) =>
    fetchMock.mockOnceIf(`${rijksDomain}/?p=1&ps=${limit}&imgonly=true&key=${rijksAPIKey}`,
        () => Promise.resolve(JSON.stringify(response)));

export const setupAICArtPieceResponse = (response: AICArtResponse, id: number) =>
    fetchMock.mockOnceIf(`${aicDomain}/${id}?fields=${fields.join()}`,
        () => Promise.resolve(JSON.stringify(response)));
