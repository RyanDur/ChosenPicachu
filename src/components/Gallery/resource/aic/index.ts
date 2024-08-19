import {
  AICAllArtResponse,
  AICAllArtSchema,
  AICArt,
  AICArtSchema,
  AICPieceData,
  AICSearchResponse,
  AICSearchSchema
} from './types';
import {toQueryString} from '../../../../util/URL';
import {aicDomain, defaultRecordLimit, defaultSearchLimit} from '../../../../config';
import {AllArt, Art, SearchOptions} from '../types/response';
import {validate} from '../../../../data/validate';
import {http} from '../../../../data/http';
import {GetAllArtRequest} from '../types/resource';

export const fields = ['id', 'title', 'image_id', 'artist_display', 'term_titles', 'thumbnail'];

export const aic = {
  allArt: ({page, size, search}: GetAllArtRequest) => http
    .get(
      `${aicDomain}${toQueryString({
        q: search, fields: fields.join(), page, limit: defaultRecordLimit, size
      })}`
    )
    .mBind(validate(AICAllArtSchema))
    .map(({pagination, data}: AICAllArtResponse): AllArt => ({
      pagination: {
        total: pagination.total,
        limit: pagination.limit,
        totalPages: pagination.total_pages,
        currentPage: pagination.current_page
      },
      pieces: data.map(aicToPiece)
    })),

  art: (id: string) => http
    .get(`${aicDomain}/${id}${toQueryString({
      fields: fields.join(),
    })}`)
    .mBind(validate(AICArtSchema))
    .map(({data}: AICPieceData): Art => aicToPiece(data)),

  searchOptions: (search: string) => http
    .get(`${aicDomain}/search${toQueryString({
      'query[term][title]': search,
      fields: 'suggest_autocomplete_all',
      limit: defaultSearchLimit
    })}`)
    .mBind(validate(AICSearchSchema))
    .map(({data}: AICSearchResponse): SearchOptions => data
      .map(({suggest_autocomplete_all}) => suggest_autocomplete_all[1])
      .flatMap(option => option.input))
};

const aicToPiece = (data: AICArt): Art => ({
  id: String(data.id),
  title: data.title,
  image: `https://www.artic.edu/iiif/2/${data.image_id}/full/2000,/0/default.jpg`,
  artistInfo: data.artist_display,
  altText: data.thumbnail?.alt_text || data.term_titles.join(' ') || ''
});
