import crossingSource from '../../crossing.ts?sample';
import dragSortSource from '../../drag-sort.ts?sample';
import slideStartsSource from '../../slide-starts.ts?sample';
import hideItemCss from '../../items/HideItem.css?sample';
import sortableListCss from '../../sortable-list.css?sample';
import {Sample} from '../../../Recipe';

type Sources = {
  crossing: Sample; dragSort: Sample; slideStarts: Sample; hideItemCss: Sample;
  sortableListCss: Sample;
};

export const sources: Sources = {
  crossing: crossingSource, dragSort: dragSortSource, slideStarts: slideStartsSource,
  hideItemCss, sortableListCss
};
