import {useContext} from 'react';
import * as schema from 'schemawax';
import {numberParam, useSearchParamsObject} from '@components/search-params';
import {sourceParam, standingOf} from '@pages/Gallery/museums';
import {defaultRecordLimit} from '@pages/Gallery/limits';
import {Walls} from './walls';

const address = {page: numberParam, size: numberParam, tab: sourceParam, search: schema.string};
const firstShown = {page: 1, size: defaultRecordLimit};

export const useGallery = () => {
  const {wall, dispatch} = useContext(Walls);
  return {
    ...useSearchParamsObject(address, firstShown),
    wall,
    pagination: standingOf(wall).map(({pagination}) => pagination),
    dispatch
  };
};
