import {
  AICAllArtResponse,
  AICArt,
  AICPieceData,
  AICSearchResponse,
  aicSchema
} from '@pages/Gallery/museums/aic/types';
import {toQueryString} from '@transport/url';
import {maybe} from '@ryandur/sand';
import {limits} from '@pages/Gallery/limits';
import {env} from '@env';
import {AllArt, Art, Door, SearchOptions} from '@pages/Gallery/museums/types';
import {validate} from '@transport/validate';
import {http} from '@transport/http';
import {GetAllArtRequest} from '@pages/Gallery/museums/requests';
import {artFields} from '@pages/Gallery/museums/artFields';

const fields = ['id', 'title', 'image_id', 'artist_display', 'term_titles', 'thumbnail'];

const iiif = (imageId: string) => `${env.aicPictures}/${imageId}`;

const aSundayOnLaGrandeJatte = '2d484387-2509-5e8e-2c43-22f9981972eb';

export const aic = {
  allArt: ({page, search, size = limits.record}: GetAllArtRequest) => http
    .get(`${env.aicDomain}/search${toQueryString({
      q: search,
      'query[exists][field]': 'image_id',
      fields,
      page,
      limit: size
    })}`, {cache: 'force-cache'})
    .mBind(validate(aicSchema.allArt))
    .map(({pagination, data}: AICAllArtResponse): AllArt => ({
      pagination: {
        total: pagination.total,
        limit: pagination.limit,
        totalPages: pagination.total_pages
      },
      pieces: data.map(aicToPiece(800))
    })),

  open: () => http.get(`${iiif(aSundayOnLaGrandeJatte)}/info.json`, {cache: 'force-cache'}).map((): Door => 'open'),

  art: (id: string) => http
    .get(`${env.aicDomain}/${id}${toQueryString({fields})}`, {cache: 'force-cache'})
    .mBind(validate(aicSchema.art))
    .map(({data}: AICPieceData): Art => aicToPiece(843)(data)),

  searchOptions: (search: string) => http
    .get(`${env.aicDomain}/search${toQueryString({
      'query[term][title]': search,
      fields: 'suggest_autocomplete_all',
      limit: limits.search
    })}`, {cache: 'force-cache'})
    .mBind(validate(aicSchema.search))
    .map(({data}: AICSearchResponse): SearchOptions => data
      .map(({suggest_autocomplete_all}) => suggest_autocomplete_all[1])
      .flatMap(option => option.input))
};

const aicImage = (imageId: string, width: number) =>
  `${iiif(imageId)}/full/${width},/0/default.jpg`;

const aicSrcSet = (imageId: string) =>
  [400, 800, 1200].map(width => `${aicImage(imageId, width)} ${width}w`).join(', ');

const pictured = (imageId: string | null | undefined, width: number): Pick<Art, 'picture'> =>
  maybe(imageId).map(id => ({picture: {src: aicImage(id, width), srcSet: aicSrcSet(id)}})).orElse({});

const aicToPiece = (width: number) => (data: AICArt): Art => ({
  id: String(data.id),
  title: data.title,
  ...pictured(data.image_id, width),
  ...artFields.attributed(data.artist_display),
  altText: maybe(data.thumbnail?.alt_text).orElse(data.term_titles.join(' '))
});
