import {has, maybe} from '@ryandur/sand';
import {
  ClevelandAllArtResponse,
  ClevelandArtResponse,
  ClevelandImage,
  ClevelandRecord,
  ClevelandSearchResponse,
  clevelandSchema
} from './types';
import {limits} from '@pages/Gallery/limits';
import {env} from '@frame/state/env';
import {toQueryString} from '@transport';
import {AllArt, Art, Door, SearchOptions} from '@pages/Gallery/museums/types';
import {validate} from '@transport';
import {http} from '@transport';
import {GetAllArtRequest} from '@pages/Gallery/museums/requests';
import {artFields} from '@pages/Gallery/museums/artFields';

const clevelandFields = ['id', 'title', 'creators', 'tombstone', 'images'].join();

const sized = (image?: ClevelandImage | null): string | undefined =>
  has(image) && has(image.width) ? `${image.url} ${image.width}w` : undefined;

const srcSetOf = (record: ClevelandRecord): string | undefined => {
  const sources = [sized(record.images?.web), sized(record.images?.print)].filter(has);
  return sources.length > 0 ? sources.join(', ') : undefined;
};

const artistOf = (record: ClevelandRecord): string | null | undefined =>
  (record.creators ?? []).map(({description}) => description).filter(has).join(', ') || record.tombstone;

const toPiece = (record: ClevelandRecord): Art => ({
  id: String(record.id),
  title: record.title,
  ...maybe(record.images?.web ?? record.images?.print)
    .map(shown => ({picture: {src: shown.url, srcSet: srcSetOf(record)}})).orElse({}),
  ...artFields.attributed(artistOf(record)),
  altText: record.title
});

const searched = ({page, search, size = limits.record}: GetAllArtRequest) => http
  .get(`${env.clevelandDomain}/${toQueryString({
    q: search,
    skip: (page - 1) * size,
    limit: size,
    has_image: 1,
    fields: clevelandFields
  })}`, {cache: 'force-cache'})
  .mBind(validate(clevelandSchema.allArt));

export const cleveland = {
  allArt: (request: GetAllArtRequest) => searched(request)
    .map(({info, data}: ClevelandAllArtResponse): AllArt => {
      const size = request.size ?? limits.record;
      return {
        pagination: {
          total: info.total,
          limit: size,
          totalPages: Math.ceil(info.total / size)
        },
        pieces: data.map(toPiece)
      };
    }),

  open: () => searched({page: 1}).map(({data}): Door => data.length > 0 ? 'open' : 'closed'),

  art: (id: string) => http
    .get(`${env.clevelandDomain}/${id}${toQueryString({fields: clevelandFields})}`, {cache: 'force-cache'})
    .mBind(validate(clevelandSchema.art))
    .map(({data}: ClevelandArtResponse): Art => toPiece(data)),

  searchOptions: (search: string) => http
    .get(`${env.clevelandDomain}/${toQueryString({
      q: search,
      limit: limits.search,
      has_image: 1,
      fields: 'title'
    })}`, {cache: 'force-cache'})
    .mBind(validate(clevelandSchema.search))
    .map(({data}: ClevelandSearchResponse): SearchOptions => data.map(({title}) => title))
};
