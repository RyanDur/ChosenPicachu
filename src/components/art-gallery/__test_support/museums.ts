import {delay, http, HttpResponse} from 'msw';
import {server} from '@test-support/server';
import {AICAllArtResponse, AICArtResponse} from '@components/art-gallery/museums/aic/types';
import {defaultRecordLimit} from '@components/art-gallery/limits';
import {env} from '@env';
import {fields} from '@components/art-gallery/museums/aic';
import {HarvardAllArtResponse} from '@components/art-gallery/museums/harvard/types';
import {harvardFields} from '@components/art-gallery/museums/harvard';
import {VAMAllArtResponse} from '@components/art-gallery/museums/vam/types';
import {ClevelandAllArtResponse} from '@components/art-gallery/museums/cleveland/types';

const {aicDomain, aicPictures, clevelandDomain, harvardAPIKey, harvardDomain, vamDomain, vamPictures} = env;

const paramsMatch = (request: Request, expected: Record<string, string>) => {
  const params = new URL(request.url).searchParams;
  return Object.entries(expected).every(([key, value]) => params.get(key) === value);
};

type AllArt = {
  limit: number,
  page: number
  search?: string,
};

const allArtParams = (options: AllArt) => ({
  'query[exists][field]': 'image_id',
  fields: fields.join(),
  page: String(options.page),
  limit: String(options.limit),
  ...(options.search ? {q: options.search} : {})
});

export const setupAICAllArtResponse = (response: AICAllArtResponse, options: AllArt = {limit: defaultRecordLimit, page: 1}) =>
  server.use(http.get(`${aicDomain}/search`, ({request}) =>
    paramsMatch(request, allArtParams(options)) ? HttpResponse.json(response) : undefined));

export const heldAICAllArtResponse = (response: AICAllArtResponse, options: AllArt = {limit: defaultRecordLimit, page: 1}): () => void => {
  let release = (): void => undefined;
  const held = new Promise<void>(resolve => {
    release = resolve;
  });
  server.use(http.get(`${aicDomain}/search`, async ({request}) => {
    if (!paramsMatch(request, allArtParams(options))) return undefined;
    await held;
    return HttpResponse.json(response);
  }));
  return release;
};

export const setupAICEveryPage = (response: AICAllArtResponse) =>
  server.use(http.get(`${aicDomain}/search`, ({request}) => {
    const page = Number(new URL(request.url).searchParams.get('page'));
    return HttpResponse.json({...response, pagination: {...response.pagination, current_page: page}});
  }));

export const setupHarvardAllArtResponse = (response: HarvardAllArtResponse, limit = defaultRecordLimit) =>
  server.use(http.get(harvardDomain, ({request}) =>
    paramsMatch(request, {
      q: 'imagepermissionlevel:0 AND _exists_:primaryimageurl',
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

export const refuseAICPictures = () =>
  server.use(http.get(`${aicPictures}/:image/info.json`, () => HttpResponse.error()));

export const refuseVAMPictures = () =>
  server.use(http.get(`${vamPictures}/:image/info.json`, () => HttpResponse.error()));

export const delayAICPictures = (ms: number) =>
  server.use(http.get(`${aicPictures}/:image/info.json`, async () => {
    await delay(ms);
    return HttpResponse.json({});
  }));

export const delayVAMPictures = (ms: number) =>
  server.use(http.get(`${vamPictures}/:image/info.json`, async () => {
    await delay(ms);
    return HttpResponse.json({});
  }));

export const setupClevelandAllArtResponse = (response: ClevelandAllArtResponse, limit = defaultRecordLimit) =>
  server.use(http.get(`${clevelandDomain}/`, ({request}) =>
    paramsMatch(request, {
      skip: '0',
      limit: String(limit),
      has_image: '1'
    }) ? HttpResponse.json(response) : undefined));

export const setupVAMAllArtResponse = (response: VAMAllArtResponse, limit = defaultRecordLimit) =>
  server.use(http.get(`${vamDomain}/objects/search`, ({request}) =>
    paramsMatch(request, {
      page: '1',
      page_size: String(limit),
      images_exist: 'true'
    }) ? HttpResponse.json(response) : undefined));
