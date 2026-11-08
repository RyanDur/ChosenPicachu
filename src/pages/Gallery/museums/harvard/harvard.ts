import {
  HarvardAllArtResponse,
  HarvardArtResponse,
  HarvardSearchResponse,
  harvardSchema
} from '@pages/Gallery/museums/harvard/types';
import {limits} from '@pages/Gallery/limits';
import {has, maybe} from '@ryandur/sand';
import {env, queryString} from '@transport';
import {AllArt, Art, Door, SearchOptions} from '@pages/Gallery/museums/types';
import {decoded} from '@transport';
import {http} from '@transport';
import {GetAllArtRequest} from '@pages/Gallery/museums/requests';
import {artFields} from '@pages/Gallery/museums/artFields';

const fields = ['id', 'title', 'people', 'primaryimageurl'].join();
const baseQueryString = {
  fields, apikey: env.harvardAPIKey
};
const withImages = (search?: string) =>
  [has(search) && `(${search})`, 'imagepermissionlevel:0', '_exists_:primaryimageurl'].filter(Boolean).join(' AND ');

const searched = ({page, search, size = limits.record}: GetAllArtRequest) => http
  .get(`${env.harvardDomain}${queryString.from({
    q: withImages(search),
    page,
    size, ...baseQueryString
  })}`, {cache: 'force-cache'})
  .mBind(decoded.by(harvardSchema.allArt));

export const harvard = {
  allArt: (request: GetAllArtRequest) => searched(request)
    .map(({info, records}: HarvardAllArtResponse): AllArt => ({
      pagination: {
        total: info.totalrecords,
        limit: info.totalrecordsperquery,
        totalPages: info.pages
      },
      pieces: records.map(harvardArtToArt)
    })),

  open: () => searched({page: 1}).map(({records}): Door => records.length > 0 ? 'open' : 'closed'),

  art: (id: string) => http
    .get(`${env.harvardDomain}/${id}${queryString.from(baseQueryString)}`, {cache: 'force-cache'})
    .mBind(decoded.by(harvardSchema.art))
    .map(harvardArtToArt),

  searchOptions: (search: string) => http
    .get(`${env.harvardDomain}${queryString.from({
      title: search,
      fields: 'title',
      apikey: env.harvardAPIKey,
      size: limits.search
    })}`, {cache: 'force-cache'})
    .mBind(decoded.by(harvardSchema.search))
    .map(({records}: HarvardSearchResponse): SearchOptions =>
      records.map(({title}) => title))
};

const harvardArtToArt = (record: HarvardArtResponse): Art => ({
  id: String(record.id),
  title: maybe(record.title).orElse('Untitled'),
  ...artFields.pictured(record.primaryimageurl),
  ...artFields.attributed(record.people?.find(person => person.role === 'Artist')?.displayname),
  altText: maybe(record.title).orElse('Untitled')
});
