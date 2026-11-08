import crossingSource from '../../crossing.ts?sample';
import dragSortSource from '../../drag-sort.ts?sample';
import slideStartsSource from '../../slide-starts.ts?sample';
import sessionSource from '../../session.ts?sample';
import hideItemCss from '../../items/HideItem.css?sample';
import {Sample} from '../../../Recipe';

type Sources = {crossing: Sample; dragSort: Sample; slideStarts: Sample; session: Sample; hideItemCss: Sample};

export const sources: Sources = {
  crossing: crossingSource, dragSort: dragSortSource, slideStarts: slideStartsSource, session: sessionSource,
  hideItemCss
};
