import {RIJKAllArtSchema, RIJKArtObjectResponse, RIJKArtSchema, RIJKSAllArtResponse, RIJKSArtResponse, RIJKSSearchSchema} from './types';
import {has} from '@ryandur/sand';
import {defaultRecordLimit, defaultSearchLimit, rijksAPIKey, rijksDomain} from '../../../../config';
import {toQueryString} from '../../../../util/URL';
import {PATH} from '../../../../data/types';
import {AllArt, Art, SearchOptions} from '../types/response';
import {GetAllArtRequest, Query} from '../types/resource';
import {validate} from '../../../../data/validate';
import {http} from '../../../../data/http';

export const rijks = {
  allArt: ({page, size, search}: GetAllArtRequest) => http
    .get(endpoint({params: {page, size, search}}))
    .mBind(validate(RIJKAllArtSchema))
    .map((data: RIJKSAllArtResponse): AllArt => ({
      pagination: {
        total: data.count,
        limit: data.artObjects.length,
        totalPages: data.count / data.artObjects.length,
        currentPage: page
      },
      pieces: data.artObjects.map(rijkToPiece)
    })),

  art: (id: string) => http
    .get(endpoint({path: [id]}))
    .mBind(validate(RIJKArtSchema))
    .map(({artObject}: RIJKSArtResponse): Art => rijkToPiece(artObject)),

  searchOptions: (search: string) => http
    .get([
      rijksDomain,
      toQueryString({
        q: search, p: 1, ps: defaultSearchLimit, imgonly: true, key: rijksAPIKey
      })].join(''))
    .mBind(validate(RIJKSSearchSchema))
    .map(({artObjects}: RIJKSAllArtResponse): SearchOptions =>
      artObjects.map(({title}) => title))
};

const rijkToPiece = (data: RIJKArtObjectResponse): Art => ({
  id: data.objectNumber,
  title: data.title,
  image: data.webImage.url,
  artistInfo: data.longTitle,
  altText: data.longTitle
});

const endpoint = ({path, params = {}}: Query): PATH => {
  const {search, limit = defaultRecordLimit, page} = params;
  return [
    [rijksDomain, path?.filter(has).join('/')].filter(has).join('/'),
    toQueryString({
      q: search,
      p: page,
      ps: limit,
      imgonly: true,
      key: rijksAPIKey
    })].join('');
};
