import {storyKeys} from '../Recipe';

const param = 'living';

export const livingStories = {
  param,
  titleIdOf: (id: string): string => storyKeys.anchorOf({param, id}),
  ids: {still: 'still', flow: 'flow', store: 'store'}
};
