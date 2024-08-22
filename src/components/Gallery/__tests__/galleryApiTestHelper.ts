import {AICAllArtResponse, AICArtResponse} from "../resource/aic/types";
import {aicDomain, defaultRecordLimit, harvardAPIKey, harvardDomain, rijksAPIKey, rijksDomain} from "../../../config";
import {fields} from "../resource/aic";
import {HarvardAllArtResponse} from "../resource/harvard/types";
import {harvardFields} from "../resource/harvard";
import {RIJKSAllArtResponse} from "../resource/rijks/types";
import {toQueryString} from "../../../util/URL";

export const setupAICAllArtResponse = (response: AICAllArtResponse, options: {
    limit: number,
    page?: number
    search?: string,
} = {limit: defaultRecordLimit}) => {
    const urlOrPredicate = `${aicDomain}/${toQueryString({
        q: options.search, fields, page: options.page, limit: options.limit
    })}`;
    return fetchMock.mockOnceIf(urlOrPredicate, () => Promise.resolve(JSON.stringify(response)));
};

export const setupHarvardAllArtResponse = (response: HarvardAllArtResponse, limit = defaultRecordLimit) =>
    fetchMock.mockOnceIf(`${harvardDomain}/?page=1&size=${limit}&fields=${harvardFields}&apikey=${harvardAPIKey}`,
        () => Promise.resolve(JSON.stringify(response)));

export const setupRijksAllArtResponse = (response: RIJKSAllArtResponse, limit = defaultRecordLimit) =>
    fetchMock.mockOnceIf(`${rijksDomain}/?p=1&ps=${limit}&imgonly=true&key=${rijksAPIKey}`,
        () => Promise.resolve(JSON.stringify(response)));

export const setupAICArtPieceResponse = (response: AICArtResponse, id: number) =>
    fetchMock.mockOnceIf(`${aicDomain}/${id}?fields=${fields.join()}`,
        () => Promise.resolve(JSON.stringify(response)));
