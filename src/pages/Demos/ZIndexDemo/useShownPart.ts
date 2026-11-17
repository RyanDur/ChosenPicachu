import {useLocation} from 'react-router';
import {Maybe} from '@ryandur/sand';
import {ZIndexPart, zIndexParts} from './part-pages';

export const useShownPart = (): Maybe<ZIndexPart> => zIndexParts.shownAt(useLocation().pathname);
