import {has, Maybe, maybe} from '@ryandur/sand';
import {
  ClevelandAllArtResponse,
  ClevelandArtResponse,
  ClevelandImage,
  ClevelandRecord,
  ClevelandSearchResponse,
  clevelandSchema
} from './types';
import {limits} from '@pages/Gallery/limits';
import {environment, queryString} from '@transport';
import {AllArt, Art, Door, SearchOptions} from '@pages/Gallery/museums/types';
import {decoded} from '@transport';
import {http} from '@transport';
import {GetAllArtRequest} from '@pages/Gallery/museums/requests';
import {artFields} from '@pages/Gallery/museums/artFields';

const clevelandFields = ['id', 'title', 'creators', 'tombstone', 'images'].join();

const sized = (image: Maybe<ClevelandImage>): string[] =>
  image.mBind(({url, width}) => maybe(width).map(across => [`${url} ${across}w`])).orElse([]);

const srcSetOf = (record: ClevelandRecord): Maybe<string> => maybe(record.images)
  .map(({web, print}) => [...sized(maybe(web)), ...sized(maybe(print))].join(', '))
  .mBind(sources => maybe(sources, written));

const written = (words: string): boolean => words !== '';

const artistOf = (record: ClevelandRecord): Maybe<string> =>
  maybe(maybe(record.creators).orElse([]).flatMap(({description}) => maybe(description).map(said => [said]).orElse([])).join(', '), written)
    .or(() => maybe(record.tombstone));

const toPiece = (record: ClevelandRecord): Art => ({
  id: String(record.id),
  title: record.title,
  ...maybe(record.images).mBind(({web, print}) => maybe(web).or(() => maybe(print)))
    .map(shown => ({picture: {src: shown.url, ...srcSetOf(record).map(srcSet => ({srcSet})).orElse({})}})).orElse({}),
  ...artistOf(record).map(artFields.attributed).orElse({}),
  altText: record.title
});

const searched = ({page, search, size = limits.record}: GetAllArtRequest) => http
  .get(`${environment.clevelandDomain}/${queryString.from({
    q: search,
    skip: (page - 1) * size,
    limit: size,
    has_image: 1,
    fields: clevelandFields
  })}`, {cache: 'force-cache'})
  .mBind(decoded.by(clevelandSchema.allArt));

export const cleveland = {
  allArt: (request: GetAllArtRequest) => searched(request)
    .map(({info, data}: ClevelandAllArtResponse): AllArt => {
      const size = maybe(request.size).orElse(limits.record);
      return {
        pagination: {
          total: info.total,
          limit: size,
          totalPages: Math.ceil(info.total / size)
        },
        pieces: data.map(toPiece)
      };
    }),

  open: () => searched({page: 1}).map(({data}): Door => has(data) ? 'open' : 'closed'),

  art: (id: string) => http
    .get(`${environment.clevelandDomain}/${id}${queryString.from({fields: clevelandFields})}`, {cache: 'force-cache'})
    .mBind(decoded.by(clevelandSchema.art))
    .map(({data}: ClevelandArtResponse): Art => toPiece(data)),

  searchOptions: (search: string) => http
    .get(`${environment.clevelandDomain}/${queryString.from({
      q: search,
      limit: limits.search,
      has_image: 1,
      fields: 'title'
    })}`, {cache: 'force-cache'})
    .mBind(decoded.by(clevelandSchema.search))
    .map(({data}: ClevelandSearchResponse): SearchOptions => data.map(({title}) => title))
};
