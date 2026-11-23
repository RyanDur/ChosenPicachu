import {useContext} from 'react';
import {Paints, PagePaints} from './PagePaints';

export const usePagePaints = (): Paints => useContext(PagePaints);
