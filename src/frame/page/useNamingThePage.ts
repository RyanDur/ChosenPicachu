import {useContext, useEffect} from 'react';
import {pageNaming} from './pageNaming';

export const useNamingThePage = (name: string): void => {
  const names = useContext(pageNaming.Namer);
  useEffect(() => names(name), [names, name]);
};
