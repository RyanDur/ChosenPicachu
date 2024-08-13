import {
  HarvardAllArt,
  HarvardAllArtSchema,
  HarvardArt,
  HarvardArtSchema,
  HarvardSearch,
  HarvardSearchSchema
} from './types';
import {has} from '@ryandur/sand';
import {defaultRecordLimit, defaultSearchLimit, harvardAPIKey, harvardDomain} from '../../../../config';
import {toQueryString} from '../../../../util/URL';
import {PATH} from '../../../../data/types';
import {AllArt, Art, SearchOptions} from '../types/response';
import {validate} from '../../../../data/validate';
import {http} from '../../../../data/http';
import {GetAllArtRequest} from '../types/resource';

export const shapeOfHarvardResponse = ['id', 'title', 'people', 'primaryimageurl'];
export const harvardArtToArt = (record: HarvardArt): Art => ({
  id: String(record.id),
  title: record.title,
  image: record.primaryimageurl,
  artistInfo: record.people?.find(person => person.role === 'Artist')?.displayname || 'Unknown',
  altText: record.title
});

interface Query {
  path?: (string | number)[];
  params?: Record<string, unknown>
}

const endpoint = ({path, params = {}}: Query): PATH => {
  const {search, limit = defaultRecordLimit, page, ...rest} = params;
  return [
    [
      harvardDomain,
      path?.filter(has).join('/')
    ].filter(has).join('/'),
    toQueryString({
      q: search,
      fields: shapeOfHarvardResponse,
      page,
      apikey: harvardAPIKey,
      size: limit,
      ...rest
    })].join('');
};

export const harvard = {
  allArt: ({page, size, search}: GetAllArtRequest) => http
    .get(endpoint({params: {page, size, search}}))
    .mBind(validate(HarvardAllArtSchema))
    .map(({info, records}: HarvardAllArt): AllArt => ({
      pagination: {
        total: info.totalrecords,
        limit: info.totalrecordsperquery,
        totalPages: info.pages,
        currentPage: info.page
      },
      pieces: records.map(harvardArtToArt)
    })),

  art: (id: string) => http
    .get(endpoint({path: [id]}))
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
    .map(({records}: HarvardSearch): SearchOptions =>
      records.map(({title}) => title))
};
