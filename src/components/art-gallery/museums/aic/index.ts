import {
  AICAllArtResponse,
  AICAllArtSchema,
  AICArt,
  AICArtSchema,
  AICPieceData,
  AICSearchResponse,
  AICSearchSchema
} from '@components/art-gallery/museums/aic/types';
import {toQueryString} from '@transport/url';
import {aicDomain, defaultRecordLimit, defaultSearchLimit} from '@components/art-gallery/museums/config';
import {AllArt, Art, SearchOptions} from '@components/art-gallery/museums/types/response';
import {validate} from '@transport/validate';
import {http} from '@transport/http';
import {GetAllArtRequest} from '@components/art-gallery/museums/types/resource';

export const fields = ['id', 'title', 'image_id', 'artist_display', 'term_titles', 'thumbnail'];

export const aic = {
  allArt: ({page, search, size = defaultRecordLimit}: GetAllArtRequest) => http
    .get(`${aicDomain}/search${toQueryString({q: search, 'query[exists][field]': 'image_id', fields, page, limit: size})}`)
    .mBind(validate(AICAllArtSchema))
    .map(({pagination, data}: AICAllArtResponse): AllArt => ({
      pagination: {
        total: pagination.total,
        limit: pagination.limit,
        totalPages: pagination.total_pages,
        currentPage: pagination.current_page
      },
      pieces: data.map(aicToPiece(800))
    })),

  art: (id: string) => http
    .get(`${aicDomain}/${id}${toQueryString({fields})}`)
    .mBind(validate(AICArtSchema))
    .map(({data}: AICPieceData): Art => aicToPiece(843)(data)),

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

const aicImage = (imageId: string | null | undefined, width: number) =>
  `https://www.artic.edu/iiif/2/${imageId}/full/${width},/0/default.jpg`;

const aicToPiece = (width: number) => (data: AICArt): Art => ({
  id: String(data.id),
  title: data.title,
  image: aicImage(data.image_id, width),
  artistInfo: data.artist_display,
  altText: data.thumbnail?.alt_text || data.term_titles.join(' ') || ''
});
