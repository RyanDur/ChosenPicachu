import {useLocation} from 'react-router';
import {Maybe} from '@ryandur/sand';
import {TablePart, tableParts} from './part-pages';

export const useShownPart = (): Maybe<TablePart> => tableParts.at(useLocation().pathname);
