export type StoryKey = {param: string; id: string};

type StoryKeys = {
  anchorOf: (story: StoryKey) => string;
  openIn: (params: URLSearchParams, param: string) => Set<string>;
  openedIn: (params: URLSearchParams, story: StoryKey) => URLSearchParams;
};

const openIn = (params: URLSearchParams, param: string): Set<string> =>
  new Set((params.get(param) ?? '').split(',').filter(part => part !== ''));

export const storyKeys: StoryKeys = {
  anchorOf: ({param, id}) => `${param}-${id}-story`,
  openIn,
  openedIn: (params, {param, id}) => {
    const next = new URLSearchParams(params);
    next.set(param, [...openIn(params, param).add(id)].join(','));
    return next;
  }
};
