import crossingSource from '../../crossing.ts?sample';
import glideSource from '@components/glide.ts?sample';
import slideStartsSource from '../../slide-starts.ts?sample';
import sessionSource from '../../session.ts?sample';
import hideItemCss from '../../items/HideItem.css?sample';
import {Sample} from '../../../Recipe';

type Sources = {crossing: Sample; glide: Sample; slideStarts: Sample; session: Sample; hideItemCss: Sample};

export const sources: Sources = {
  crossing: crossingSource, glide: glideSource, slideStarts: slideStartsSource, session: sessionSource, hideItemCss
};
