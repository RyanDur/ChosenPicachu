import {AICAllArtResponse, AICArtResponse} from "../resource/aic/types";
import {aicDomain, defaultRecordLimit, harvardAPIKey, harvardDomain, rijksAPIKey, rijksDomain} from "../../../config";
import {fields} from "../resource/aic";
import {HarvardAllArtResponse} from "../resource/harvard/types";
import {harvardFields} from "../resource/harvard";
import {RIJKSAllArtResponse} from "../resource/rijks/types";

export const setupAICAllArtResponse = (response: AICAllArtResponse, options: {
    limit: number,
    page: number
    search?: string,
} = {limit: defaultRecordLimit, page: 1}) => {
    fetchMock.mockResponseOnce(JSON.stringify(response), {
        url: `https://example.com?fields=id,title,image_id,artist_display,term_titles,thumbnail&page=${options.page}&limit=${options.limit}`
    });
    fetchMock.mockResponseOnce(JSON.stringify(response), {
        url: `https://example.com/?fields=id,title,image_id,artist_display,term_titles,thumbnail&page=${options.page}&limit=${options.limit}`
    });
};

export const setupHarvardAllArtResponse = (response: HarvardAllArtResponse, limit = defaultRecordLimit) => {
    const urlOrPredicate = new RegExp(`${harvardDomain}/\\?page=1&size=${limit}&fields=${harvardFields}&apikey=${harvardAPIKey}`);
    return fetchMock.doMockIf(urlOrPredicate,
      () => Promise.resolve(JSON.stringify(response)));
};

export const setupRijksAllArtResponse = (response: RIJKSAllArtResponse, limit = defaultRecordLimit) =>
    fetchMock.dontMockIf(`${rijksDomain}?p=1&ps=${limit}&imgonly=true&key=${rijksAPIKey}`,
        () => Promise.resolve(JSON.stringify(response)));

export const setupAICArtPieceResponse = (response: AICArtResponse, id: number) => {
    fetchMock.mockResponseOnce(JSON.stringify(response), {
        url: `${aicDomain}/${id}?fields=${fields.join()}`
    });
};
