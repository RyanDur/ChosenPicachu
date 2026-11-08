import {http, HttpResponse} from 'msw';
import {has, maybe} from '@ryandur/sand';
import {server} from '@__test_support/server';
import {AICAllArtResponse, AICArtResponse, AICSearchResponse} from '@pages/Gallery/museums/aic/types';
import {limits} from '@pages/Gallery/limits';
import {env} from '@frame/state';
import {HarvardAllArtResponse} from '@pages/Gallery/museums/harvard/types';
import {VAMAllArtResponse} from '@pages/Gallery/museums/vam/types';
import {ClevelandAllArtResponse} from '@pages/Gallery/museums/cleveland/types';
import {onTestFinished} from 'vitest';

const aicFields = 'id,title,image_id,artist_display,term_titles,thumbnail';
const harvardFields = 'id,title,people,primaryimageurl';

const paramsMatch = (request: Request, expected: Record<string, string>) => {
  const params = new URL(request.url).searchParams;
  return Object.entries(expected).every(([key, value]) => params.get(key) === value);
};

type Picked = (request: URL) => string | null;

const notedOn = (moment: 'request:start' | 'response:mocked') => (picked: Picked): readonly string[] => {
  const notes: string[] = [];
  const note = ({request}: {request: Request}): void => {
    maybe(picked(new URL(request.url))).map(pick => notes.push(pick));
  };
  server.events.on(moment, note);
  onTestFinished(() => {
    server.events.removeListener(moment, note);
  });
  return notes;
};

export const requestsAsked = notedOn('request:start');
export const requestsAnswered = notedOn('response:mocked');

const holding = (): {held: Promise<void>; release: () => void} => {
  let release = (): void => undefined;
  const held = new Promise<void>(resolve => {
    release = resolve;
  });
  return {held, release};
};

type AllArt = {
  limit: number;
  page: number;
  search?: string;
};

const allArtParams = (options: AllArt) => ({
  'query[exists][field]': 'image_id',
  fields: aicFields,
  page: String(options.page),
  limit: String(options.limit),
  ...(has(options.search) ? {q: options.search} : {})
});

export const setupAICAllArtResponse = (response: AICAllArtResponse, options: AllArt = {
  limit: limits.record,
  page: 1
}) =>
  server.use(http.get(`${env.aicDomain}/search`, ({request}) =>
    paramsMatch(request, allArtParams(options)) ? HttpResponse.json(response) : undefined));

export const heldAICAllArtResponse = (response: AICAllArtResponse, options: AllArt = {
  limit: limits.record,
  page: 1
}): () => void => {
  const {held, release} = holding();
  server.use(http.get(`${env.aicDomain}/search`, async ({request}) => {
    if (!paramsMatch(request, allArtParams(options))) return undefined;
    await held;
    return HttpResponse.json(response);
  }));
  return release;
};

export const setupAICEveryPage = (response: AICAllArtResponse) =>
  server.use(http.get(`${env.aicDomain}/search`, () => HttpResponse.json(response)));

type HeldAnswer = {
  arrives: () => void;
  served: Promise<{aborted: boolean}>;
};

export const heldAICSuggestions = (word: string, response: AICSearchResponse): HeldAnswer => {
  const {held, release} = holding();
  let serve = (_outcome: {aborted: boolean}): void => undefined;
  const served = new Promise<{aborted: boolean}>(resolve => {
    serve = resolve;
  });
  server.use(http.get(`${env.aicDomain}/search`, async ({request}) => {
    if (!paramsMatch(request, {'query[term][title]': word, fields: 'suggest_autocomplete_all'})) return undefined;
    await held;
    serve({aborted: request.signal.aborted});
    return HttpResponse.json(response);
  }));
  return {arrives: release, served};
};

export const setupHarvardAllArtResponse = (response: HarvardAllArtResponse, limit = limits.record) =>
  server.use(http.get(env.harvardDomain, ({request}) =>
    paramsMatch(request, {
      q: 'imagepermissionlevel:0 AND _exists_:primaryimageurl',
      page: '1',
      size: String(limit),
      fields: harvardFields,
      apikey: env.harvardAPIKey
    }) ? HttpResponse.json(response) : undefined));

export const setupAICArtPieceResponse = (response: AICArtResponse, id: number) =>
  server.use(http.get(`${env.aicDomain}/:id`, ({request, params}) =>
    params.id === String(id) && paramsMatch(request, {fields: aicFields})
      ? HttpResponse.json(response)
      : undefined));

export const heldAICArtPieceResponse = (response: AICArtResponse, id: number): () => void => {
  const {held, release} = holding();
  server.use(http.get(`${env.aicDomain}/:id`, async ({request, params}) => {
    if (params.id !== String(id) || !paramsMatch(request, {fields: aicFields})) return undefined;
    await held;
    return HttpResponse.json(response);
  }));
  return release;
};

export const refuseAICPictures = () =>
  server.use(http.get(`${env.aicPictures}/:image/info.json`, () => HttpResponse.error()));

export const refuseVAMPictures = () =>
  server.use(http.get(`${env.vamPictures}/:image/info.json`, () => HttpResponse.error()));

export const heldAICPictures = (): () => void => {
  const {held, release} = holding();
  server.use(http.get(`${env.aicPictures}/:image/info.json`, async () => {
    await held;
    return HttpResponse.json({});
  }));
  return release;
};

export const heldVAMPictures = (): () => void => {
  const {held, release} = holding();
  server.use(http.get(`${env.vamPictures}/:image/info.json`, async () => {
    await held;
    return HttpResponse.json({});
  }));
  return release;
};

export const setupClevelandAllArtResponse = (
  response: ClevelandAllArtResponse,
  {limit, page, search}: AllArt = {limit: limits.record, page: 1}
) =>
  server.use(http.get(`${env.clevelandDomain}/`, ({request}) =>
    paramsMatch(request, {
      skip: String((page - 1) * limit),
      limit: String(limit),
      has_image: '1',
      ...(has(search) ? {q: search} : {})
    }) ? HttpResponse.json(response) : undefined));

export const setupVAMAllArtResponse = (
  response: VAMAllArtResponse,
  {limit, page, search}: AllArt = {limit: limits.record, page: 1}
) =>
  server.use(http.get(`${env.vamDomain}/objects/search`, ({request}) =>
    paramsMatch(request, {
      page: String(page),
      page_size: String(limit),
      images_exist: 'true',
      ...(has(search) ? {q: search} : {})
    }) ? HttpResponse.json(response) : undefined));

export const heldVAMAllArtResponse = (
  response: VAMAllArtResponse,
  {limit, page}: AllArt = {limit: limits.record, page: 1}
): () => void => {
  const {held, release} = holding();
  server.use(http.get(`${env.vamDomain}/objects/search`, async ({request}) => {
    if (!paramsMatch(request, {page: String(page), page_size: String(limit), images_exist: 'true'})) return undefined;
    await held;
    return HttpResponse.json(response);
  }));
  return release;
};

export const harvardNeverAnswers = () =>
  server.use(http.get(env.harvardDomain, () => new Promise<never>(() => undefined)));
