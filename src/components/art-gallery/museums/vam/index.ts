import {VAMAllArtResponse, VAMAllArtSchema, VAMArtResponse, VAMArtSchema, VAMSearchRecord} from '@components/art-gallery/museums/vam/types';
import {defaultRecordLimit, defaultSearchLimit, vamDomain} from '@components/art-gallery/museums/config';
import {toQueryString} from '@transport/url';
import {AllArt, Art, SearchOptions} from '@components/art-gallery/museums/types/response';
import {validate} from '@transport/validate';
import {http} from '@transport/http';
import {GetAllArtRequest} from '@components/art-gallery/museums/types/resource';

const iiifImage = (base: string) => `${base}full/!2000,2000/0/default.jpg`;

const vamRecordToArt = (record: VAMSearchRecord): Art => ({
  id: record.systemNumber,
  title: record._primaryTitle || 'Untitled',
  image: record._images && iiifImage(record._images._iiif_image_base_url),
  artistInfo: record._primaryMaker?.name || 'Unknown',
  altText: record._primaryTitle || 'Untitled'
});

export const vam = {
  allArt: ({page, search, size = defaultRecordLimit}: GetAllArtRequest) => http
    .get(`${vamDomain}/objects/search${toQueryString({q: search, page, page_size: size, images_exist: true})}`)
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

  art: (id: string) => http
    .get(`${vamDomain}/museumobject/${id}`)
    .mBind(validate(VAMArtSchema))
    .map(({record}: VAMArtResponse): Art => ({
      id: record.systemNumber,
      title: record.titles?.[0]?.title || record.objectType,
      image: record.images?.[0] && iiifImage(`https://framemark.vam.ac.uk/collections/${record.images[0]}/`),
      artistInfo: record.artistMakerPerson?.[0]?.name.text || 'Unknown',
      altText: record.titles?.[0]?.title || record.objectType
    })),

  searchOptions: (search: string) => http
    .get(`${vamDomain}/objects/search${toQueryString({q: search, page_size: defaultSearchLimit})}`)
    .mBind(validate(VAMAllArtSchema))
    .map(({records}: VAMAllArtResponse): SearchOptions => records.map(({_primaryTitle}) => _primaryTitle))
};
