export type StoryKey = {param: string; id: string};

export const storyAnchor = ({param, id}: StoryKey): string => `${param}-${id}-story`;
