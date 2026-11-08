import {
  VAMAllArtResponse,
  VAMArtResponse,
  VAMSearchRecord,
  vamSchema
} from '@pages/Gallery/museums/vam/types';
import {limits} from '@pages/Gallery/limits';
import {env} from '@frame/state/env';
import {maybe} from '@ryandur/sand';
import {toQueryString} from '@transport';
import {AllArt, Art, Door, SearchOptions} from '@pages/Gallery/museums/types';
import {validate} from '@transport';
import {http} from '@transport';
import {GetAllArtRequest} from '@pages/Gallery/museums/requests';
import {artFields} from '@pages/Gallery/museums/artFields';

const iiifImage = (base: string, size: number) => `${base}full/!${size},${size}/0/default.jpg`;

const iiifSrcSet = (base: string) =>
  [400, 800, 1200].map(size => `${iiifImage(base, size)} ${size}w`).join(', ');

const vamRecordToArt = (record: VAMSearchRecord): Art => ({
  id: record.systemNumber,
  title: record._primaryTitle || 'Untitled',
  ...maybe(record._images).map(({_iiif_image_base_url: base}) => ({
    picture: {src: iiifImage(base, 800), srcSet: iiifSrcSet(base)}
  })).orElse({}),
  ...artFields.attributed(record._primaryMaker?.name),
  altText: record._primaryTitle || 'Untitled'
});

const tipuSultan = '2009BY1329';

export const vam = {
  allArt: ({page, search, size = limits.record}: GetAllArtRequest) => http
    .get(`${env.vamDomain}/objects/search${toQueryString({
      q: search,
      page,
      page_size: size,
      images_exist: true
    })}`, {cache: 'force-cache'})
    .mBind(validate(vamSchema.allArt))
    .map(({info, records}: VAMAllArtResponse): AllArt => ({
      pagination: {
        total: info.record_count,
        limit: info.page_size,
        totalPages: info.pages
      },
      pieces: records.map(vamRecordToArt)
    })),

  open: () => http.get(`${env.vamPictures}/${tipuSultan}/info.json`, {cache: 'force-cache'}).map((): Door => 'open'),

  art: (id: string) => http
    .get(`${env.vamDomain}/museumobject/${id}`, {cache: 'force-cache'})
    .mBind(validate(vamSchema.art))
    .map(({record}: VAMArtResponse): Art => ({
      id: record.systemNumber,
      title: maybe(record.titles?.[0]?.title).orElse(record.objectType),
      ...maybe(record.images?.[0]).map(first => ({picture: {src: iiifImage(`https://framemark.vam.ac.uk/collections/${first}/`, 2000)}})).orElse({}),
      ...artFields.attributed(record.artistMakerPerson?.[0]?.name.text),
      altText: maybe(record.titles?.[0]?.title).orElse(record.objectType)
    })),

  searchOptions: (search: string) => http
    .get(`${env.vamDomain}/objects/search${toQueryString({
      q: search,
      page_size: limits.search
    })}`, {cache: 'force-cache'})
    .mBind(validate(vamSchema.allArt))
    .map(({records}: VAMAllArtResponse): SearchOptions => records.map(({_primaryTitle}) => _primaryTitle))
};
