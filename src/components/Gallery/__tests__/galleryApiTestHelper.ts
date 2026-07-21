import {http, HttpResponse} from 'msw';
import {server} from '../../../__tests__/util/server';
import {AICAllArtResponse, AICArtResponse} from '../resource/aic/types';
import {aicDomain, defaultRecordLimit, harvardAPIKey, harvardDomain, vamDomain} from '../../../config';
import {fields} from '../resource/aic';
import {HarvardAllArtResponse} from '../resource/harvard/types';
import {harvardFields} from '../resource/harvard';
import {VAMAllArtResponse} from '../resource/vam/types';

const paramsMatch = (request: Request, expected: Record<string, string>) => {
  const params = new URL(request.url).searchParams;
  return Object.entries(expected).every(([key, value]) => params.get(key) === value);
};

export const setupAICAllArtResponse = (response: AICAllArtResponse, options: {
  limit: number,
  page: number
  search?: string,
} = {limit: defaultRecordLimit, page: 1}) =>
  server.use(http.get(aicDomain, ({request}) =>
    paramsMatch(request, {
      fields: fields.join(),
      page: String(options.page),
      limit: String(options.limit)
    }) ? HttpResponse.json(response) : undefined));

export const setupHarvardAllArtResponse = (response: HarvardAllArtResponse, limit = defaultRecordLimit) =>
  server.use(http.get(harvardDomain, ({request}) =>
    paramsMatch(request, {
      page: '1',
      size: String(limit),
      fields: harvardFields,
      apikey: harvardAPIKey
    }) ? HttpResponse.json(response) : undefined));

export const setupAICArtPieceResponse = (response: AICArtResponse, id: number) =>
  server.use(http.get(`${aicDomain}/:id`, ({request, params}) =>
    params.id === String(id) && paramsMatch(request, {fields: fields.join()})
      ? HttpResponse.json(response)
      : undefined));

export const setupVAMAllArtResponse = (response: VAMAllArtResponse, limit = defaultRecordLimit) =>
  server.use(http.get(`${vamDomain}/objects/search`, ({request}) =>
    paramsMatch(request, {
      page: '1',
      page_size: String(limit),
      images_exist: 'true'
    }) ? HttpResponse.json(response) : undefined));
