import {useLocation} from 'react-router';
import {Maybe} from '@ryandur/sand';
import {AccordionPart, accordionParts} from './part-pages';

export const useShownPart = (): Maybe<AccordionPart> => accordionParts.shownAt(useLocation().pathname);
