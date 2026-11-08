import {useContext} from 'react';
import * as schema from 'schemawax';
import {numberParam, useSearchParamsObject} from '@navigation/search-params';
import {museumReply, sourceParam} from '@pages/Gallery/museums';
import {opening} from '@pages/Gallery/opening';
import {Wall} from './wall';

const address = {page: numberParam, size: numberParam, tab: sourceParam, search: schema.string};
const firstShown = {page: opening.page, size: opening.size};

export const useGallery = () => {
  const {wall, dispatch} = useContext(Wall);
  return {
    ...useSearchParamsObject(address, firstShown),
    wall,
    pagination: museumReply.standingOf(wall).map(({pagination}) => pagination),
    dispatch
  };
};
