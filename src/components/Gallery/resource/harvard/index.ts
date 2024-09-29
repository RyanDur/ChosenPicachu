import {
  HarvardAllArtResponse,
  HarvardAllArtSchema,
  HarvardArtResponse,
  HarvardArtSchema,
  HarvardSearchResponse,
  HarvardSearchSchema
} from './types';
import {defaultRecordLimit, defaultSearchLimit, harvardAPIKey, harvardDomain} from '../../../../config';
import {toQueryString} from '../../../../util/URL';
import {AllArt, Art, SearchOptions} from '../types/response';
import {validate} from '../../../../data/validate';
import {http} from '../../../../data/http';
import {GetAllArtRequest} from '../types/resource';

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
  title: record.title,
  image: record.primaryimageurl,
  artistInfo: record.people?.find(person => person.role === 'Artist')?.displayname || 'Unknown',
  altText: record.title
});
