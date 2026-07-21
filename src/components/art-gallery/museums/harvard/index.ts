import {
  HarvardAllArtResponse,
  HarvardAllArtSchema,
  HarvardArtResponse,
  HarvardArtSchema,
  HarvardSearchResponse,
  HarvardSearchSchema
} from '@components/art-gallery/museums/harvard/types';
import {defaultRecordLimit, defaultSearchLimit, harvardAPIKey, harvardDomain} from '@components/art-gallery/museums/config';
import {toQueryString} from '@transport/url';
import {AllArt, Art, SearchOptions} from '@components/art-gallery/museums/types/response';
import {validate} from '@transport/validate';
import {http} from '@transport/http';
import {GetAllArtRequest} from '@components/art-gallery/museums/types/resource';

export const harvardFields = ['id', 'title', 'people', 'primaryimageurl'].join();
const baseQueryString = {
  fields: harvardFields, apikey: harvardAPIKey
};
export const harvard = {
  allArt: ({page, search, size = defaultRecordLimit}: GetAllArtRequest) => http
    .get(`${harvardDomain}${toQueryString({q: search, page, size, ...baseQueryString})}`)
    .mBind(validate(HarvardAllArtSchema))
    .map(({info, records}: HarvardAllArtResponse): AllArt => ({
      pagination: {
        total: info.totalrecords,
        limit: info.totalrecordsperquery,
        totalPages: info.pages,
        currentPage: info.page
      },
      pieces: records.map(harvardArtToArt)
    })),

  art: (id: string) => http
    .get(`${harvardDomain}/${id}${toQueryString(baseQueryString)}`)
    .mBind(validate(HarvardArtSchema))
    .map(harvardArtToArt),

  searchOptions: (search: string) => http
    .get(`${harvardDomain}${toQueryString({
      title: search,
      fields: 'title',
      apikey: harvardAPIKey,
      size: defaultSearchLimit
    })}`)
    .mBind(validate(HarvardSearchSchema))
    .map(({records}: HarvardSearchResponse): SearchOptions =>
      records.map(({title}) => title))
};

const harvardArtToArt = (record: HarvardArtResponse): Art => ({
  id: String(record.id),
  title: record.title || 'Untitled',
  image: record.primaryimageurl,
  artistInfo: record.people?.find(person => person.role === 'Artist')?.displayname || 'Unknown',
  altText: record.title || 'Untitled'
});
