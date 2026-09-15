import {
  HarvardAllArtResponse,
  HarvardAllArtSchema,
  HarvardArtResponse,
  HarvardArtSchema,
  HarvardSearchResponse,
  HarvardSearchSchema
} from '@components/art-gallery/museums/harvard/types';
import {defaultRecordLimit, defaultSearchLimit} from '@components/art-gallery/limits';
import {has, maybe} from '@ryandur/sand';
import {env} from '@env';
import {toQueryString} from '@transport/url';
import {AllArt, Art, SearchOptions} from '@components/art-gallery/museums/art';
import {validate} from '@transport/validate';
import {http} from '@transport/http';
import {GetAllArtRequest} from '@components/art-gallery/museums/source';
import {pictured} from '@components/art-gallery/museums/pictured';

const {harvardAPIKey, harvardDomain} = env;

export const harvardFields = ['id', 'title', 'people', 'primaryimageurl'].join();
const baseQueryString = {
  fields: harvardFields, apikey: harvardAPIKey
};
const withImages = (search?: string) =>
  [has(search) && `(${search})`, 'imagepermissionlevel:0', '_exists_:primaryimageurl'].filter(Boolean).join(' AND ');

const searched = ({page, search, size = defaultRecordLimit}: GetAllArtRequest) => http
  .get(`${harvardDomain}${toQueryString({
    q: withImages(search),
    page,
    size, ...baseQueryString
  })}`, {cache: 'force-cache'})
  .mBind(validate(HarvardAllArtSchema));

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

  open: () => searched({page: 1}).map(({records}) => records.length > 0),

  art: (id: string) => http
    .get(`${harvardDomain}/${id}${toQueryString(baseQueryString)}`, {cache: 'force-cache'})
    .mBind(validate(HarvardArtSchema))
    .map(harvardArtToArt),

  searchOptions: (search: string) => http
    .get(`${harvardDomain}${toQueryString({
      title: search,
      fields: 'title',
      apikey: harvardAPIKey,
      size: defaultSearchLimit
    })}`, {cache: 'force-cache'})
    .mBind(validate(HarvardSearchSchema))
    .map(({records}: HarvardSearchResponse): SearchOptions =>
      records.map(({title}) => title))
};

const harvardArtToArt = (record: HarvardArtResponse): Art => ({
  id: String(record.id),
  title: maybe(record.title).orElse('Untitled'),
  ...pictured(record.primaryimageurl),
  artistInfo: maybe(record.people?.find(person => person.role === 'Artist')?.displayname).orElse('Unknown'),
  altText: maybe(record.title).orElse('Untitled')
});
