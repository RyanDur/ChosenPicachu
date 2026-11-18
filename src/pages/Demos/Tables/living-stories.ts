const param = 'living';

export const livingStories = {
  param,
  titleIdOf: (id: string): string => `${param}-${id}-story`,
  ids: {still: 'still', flow: 'flow', store: 'store'}
};
