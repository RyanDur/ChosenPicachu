import {useContext} from 'react';
import {pageNaming} from './pageNaming';

export const usePageName = (): string => useContext(pageNaming.Name);
