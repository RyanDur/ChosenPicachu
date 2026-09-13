import {VAMAllArtResponse, VAMAllArtSchema, VAMArtResponse, VAMArtSchema, VAMSearchRecord} from '@components/art-gallery/museums/vam/types';
import {defaultRecordLimit, defaultSearchLimit} from '@components/art-gallery/limits';
import {env} from '@env';
import {maybe} from '@ryandur/sand';
import {toQueryString} from '@transport/url';
import {AllArt, Art, SearchOptions} from '@components/art-gallery/museums/types/response';
import {validate} from '@transport/validate';
import {http} from '@transport/http';
import {GetAllArtRequest} from '@components/art-gallery/museums/types/resource';

const {vamDomain, vamPictures} = env;

const iiifImage = (base: string, size: number) => `${base}full/!${size},${size}/0/default.jpg`;

const iiifSrcSet = (base: string) =>
  [400, 800, 1200].map(size => `${iiifImage(base, size)} ${size}w`).join(', ');

const vamRecordToArt = (record: VAMSearchRecord): Art => ({
  id: record.systemNumber,
  title: record._primaryTitle || 'Untitled',
  ...maybe(record._images).map(({_iiif_image_base_url: base}) => ({image: iiifImage(base, 800), srcSet: iiifSrcSet(base)})).orElse({}),
  artistInfo: record._primaryMaker?.name || 'Unknown',
  altText: record._primaryTitle || 'Untitled'
});

const tipuSultan = '2009BY1329';

export const vam = {
  allArt: ({page, search, size = defaultRecordLimit}: GetAllArtRequest) => http
    .get(`${vamDomain}/objects/search${toQueryString({q: search, page, page_size: size, images_exist: true})}`, {cache: 'force-cache'})
    .mBind(validate(VAMAllArtSchema))
    .map(({info, records}: VAMAllArtResponse): AllArt => ({
      pagination: {
        total: info.record_count,
        limit: info.page_size,
        totalPages: info.pages,
        currentPage: info.page
      },
      pieces: records.map(vamRecordToArt)
    })),

  open: () => http.get(`${vamPictures}/${tipuSultan}/info.json`, {cache: 'force-cache'}).map(() => true),

  art: (id: string) => http
    .get(`${vamDomain}/museumobject/${id}`, {cache: 'force-cache'})
    .mBind(validate(VAMArtSchema))
    .map(({record}: VAMArtResponse): Art => ({
      id: record.systemNumber,
      title: record.titles?.[0]?.title || record.objectType,
      ...maybe(record.images?.[0]).map(first => ({image: iiifImage(`https://framemark.vam.ac.uk/collections/${first}/`, 2000)})).orElse({}),
      artistInfo: record.artistMakerPerson?.[0]?.name.text || 'Unknown',
      altText: record.titles?.[0]?.title || record.objectType
    })),

  searchOptions: (search: string) => http
    .get(`${vamDomain}/objects/search${toQueryString({q: search, page_size: defaultSearchLimit})}`, {cache: 'force-cache'})
    .mBind(validate(VAMAllArtSchema))
    .map(({records}: VAMAllArtResponse): SearchOptions => records.map(({_primaryTitle}) => _primaryTitle))
};
