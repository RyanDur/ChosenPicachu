import {useLocation} from 'react-router';
import {Maybe} from '@ryandur/sand';
import {ChartKind, chartKinds} from './chart-kinds';

export const useShownChart = (): Maybe<ChartKind> => chartKinds.shownAt(useLocation().pathname);
