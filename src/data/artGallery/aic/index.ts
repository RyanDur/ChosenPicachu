import {AICAllArt, AICAllArtSchema, AICArt, AICArtSchema, AICPieceData, AICSearch, AICSearchSchema} from './types';
import {toQueryString} from '../../../util/URL';
import {has, maybe} from '@ryandur/sand';
import {aicDomain, defaultRecordLimit, defaultSearchLimit} from '../../../config';
import {PATH} from '../../types';
import {AllArt, Art, SearchOptions} from '../types/response';
import {validate} from '../../validate';
import {http} from '../../http.ts';
import {GetAllArtRequest} from '../types/resource.ts';

export const shapeOfAICResponse = ['id', 'title', 'image_id', 'artist_display', 'term_titles', 'thumbnail'];
export const aicToPiece = (data: AICArt): Art => ({
  id: String(data.id),
  title: data.title,
  image: `https://www.artic.edu/iiif/2/${data.image_id}/full/2000,/0/default.jpg`,
  artistInfo: data.artist_display,
  altText: data.thumbnail?.alt_text || data.term_titles.join(' ') || ''
});

interface Query {
  path?: (string | number)[];
  params?: Record<string, unknown>
}

const endpoint = ({path, params = {}}: Query): PATH => {
  const {search, limit = defaultRecordLimit, page, ...rest} = params;
  const queryString = toQueryString({
    q: search, fields: shapeOfAICResponse,
    page, limit, ...rest
  });
  return maybe(search).map(() => [[
    aicDomain,
    'search'
  ].join('/'), queryString].join('')).orElse([[
    aicDomain,
    path?.filter(has).join('/')
  ].filter(has).join('/'), queryString].join(''));
};
export const aic = {
  allArt: ({page, size, search}: GetAllArtRequest) => http
    .get(endpoint({params: {page, size, search}}))
    .mBind(validate(AICAllArtSchema))
    .map(({pagination, data}: AICAllArt): AllArt => ({
      pagination: {
        total: pagination.total,
        limit: pagination.limit,
        totalPages: pagination.total_pages,
        currentPage: pagination.current_page
      },
      pieces: data.map(aicToPiece)
    })),

  art: (id: string) => http
    .get(endpoint({path: [id]}))
    .mBind(validate(AICArtSchema))
    .map(({data}: AICPieceData): Art => aicToPiece(data)),

  searchOptions: (search: string) => http
    .get(`${aicDomain}/search${toQueryString({
      'query[term][title]': search,
      fields: 'suggest_autocomplete_all',
      limit: defaultSearchLimit
    })}`)
    .mBind(validate(AICSearchSchema))
    .map(({data}: AICSearch): SearchOptions => data
      .map(({suggest_autocomplete_all}) => suggest_autocomplete_all[1])
      .flatMap(option => option.input))
};
