import {has} from '@ryandur/sand';
import {
  ClevelandAllArtResponse,
  ClevelandAllArtSchema,
  ClevelandArtResponse,
  ClevelandArtSchema,
  ClevelandImage,
  ClevelandRecord,
  ClevelandSearchResponse,
  ClevelandSearchSchema
} from './types';
import {defaultRecordLimit, defaultSearchLimit} from '@components/art-gallery/limits';
import {env} from '@env';
import {toQueryString} from '@transport/url';
import {AllArt, Art, SearchOptions} from '@components/art-gallery/museums/art';
import {validate} from '@transport/validate';
import {http} from '@transport/http';
import {GetAllArtRequest} from '@components/art-gallery/museums/source';

const {clevelandDomain} = env;

export const clevelandFields = ['id', 'title', 'creators', 'tombstone', 'images'].join();

const sized = (image?: ClevelandImage | null): string | undefined =>
  has(image) && has(image.width) ? `${image.url} ${image.width}w` : undefined;

const srcSetOf = (record: ClevelandRecord): string | undefined => {
  const sources = [sized(record.images?.web), sized(record.images?.print)].filter(has);
  return sources.length > 0 ? sources.join(', ') : undefined;
};

const artistInfoOf = (record: ClevelandRecord): string =>
  (record.creators ?? []).map(({description}) => description).filter(has).join(', ') || record.tombstone || 'Unknown';

const toPiece = (record: ClevelandRecord): Art => ({
  id: String(record.id),
  title: record.title,
  image: record.images?.web?.url,
  srcSet: srcSetOf(record),
  artistInfo: artistInfoOf(record),
  altText: record.title
});

const searched = ({page, search, size = defaultRecordLimit}: GetAllArtRequest) => http
  .get(`${clevelandDomain}/${toQueryString({
    q: search,
    skip: (page - 1) * size,
    limit: size,
    has_image: 1,
    fields: clevelandFields
  })}`, {cache: 'force-cache'})
  .mBind(validate(ClevelandAllArtSchema));

export const cleveland = {
  allArt: (request: GetAllArtRequest) => searched(request)
    .map(({info, data}: ClevelandAllArtResponse): AllArt => {
      const size = request.size ?? defaultRecordLimit;
      return {
        pagination: {
          total: info.total,
          limit: size,
          totalPages: Math.ceil(info.total / size),
        },
        pieces: data.map(toPiece)
      };
    }),

  open: () => searched({page: 1}).map(({data}) => data.length > 0),

  art: (id: string) => http
    .get(`${clevelandDomain}/${id}${toQueryString({fields: clevelandFields})}`, {cache: 'force-cache'})
    .mBind(validate(ClevelandArtSchema))
    .map(({data}: ClevelandArtResponse): Art => toPiece(data)),

  searchOptions: (search: string) => http
    .get(`${clevelandDomain}/${toQueryString({
      q: search,
      limit: defaultSearchLimit,
      has_image: 1,
      fields: 'title'
    })}`, {cache: 'force-cache'})
    .mBind(validate(ClevelandSearchSchema))
    .map(({data}: ClevelandSearchResponse): SearchOptions => data.map(({title}) => title))
};
