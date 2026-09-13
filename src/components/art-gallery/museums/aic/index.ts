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
import {maybe} from '@ryandur/sand';
import {defaultRecordLimit, defaultSearchLimit} from '@components/art-gallery/limits';
import {env} from '@env';
import {AllArt, Art, SearchOptions} from '@components/art-gallery/museums/types/response';
import {validate} from '@transport/validate';
import {http} from '@transport/http';
import {GetAllArtRequest} from '@components/art-gallery/museums/types/resource';

const {aicDomain, aicPictures} = env;

export const fields = ['id', 'title', 'image_id', 'artist_display', 'term_titles', 'thumbnail'];

const iiif = (imageId: string) => `${aicPictures}/${imageId}`;

const aSundayOnLaGrandeJatte = '2d484387-2509-5e8e-2c43-22f9981972eb';

export const aic = {
  allArt: ({page, search, size = defaultRecordLimit}: GetAllArtRequest) => http
    .get(`${aicDomain}/search${toQueryString({q: search, 'query[exists][field]': 'image_id', fields, page, limit: size})}`, {cache: 'force-cache'})
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

  open: () => http.get(`${iiif(aSundayOnLaGrandeJatte)}/info.json`, {cache: 'force-cache'}).map(() => true),

  art: (id: string) => http
    .get(`${aicDomain}/${id}${toQueryString({fields})}`, {cache: 'force-cache'})
    .mBind(validate(AICArtSchema))
    .map(({data}: AICPieceData): Art => aicToPiece(843)(data)),

  searchOptions: (search: string) => http
    .get(`${aicDomain}/search${toQueryString({
      'query[term][title]': search,
      fields: 'suggest_autocomplete_all',
      limit: defaultSearchLimit
    })}`, {cache: 'force-cache'})
    .mBind(validate(AICSearchSchema))
    .map(({data}: AICSearchResponse): SearchOptions => data
      .map(({suggest_autocomplete_all}) => suggest_autocomplete_all[1])
      .flatMap(option => option.input))
};

const aicImage = (imageId: string, width: number) =>
  `${iiif(imageId)}/full/${width},/0/default.jpg`;

const aicSrcSet = (imageId: string) =>
  [400, 800, 1200].map(width => `${aicImage(imageId, width)} ${width}w`).join(', ');

const pictured = (imageId: string | null | undefined, width: number): Pick<Art, 'image' | 'srcSet'> =>
  maybe(imageId).map(id => ({image: aicImage(id, width), srcSet: aicSrcSet(id)})).orElse({});

const aicToPiece = (width: number) => (data: AICArt): Art => ({
  id: String(data.id),
  title: data.title,
  ...pictured(data.image_id, width),
  artistInfo: data.artist_display,
  altText: data.thumbnail?.alt_text || data.term_titles.join(' ') || ''
});
