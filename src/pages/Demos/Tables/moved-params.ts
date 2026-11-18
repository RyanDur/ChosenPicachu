import {livingStories} from './living-stories';

const tutorial = 'tut';
const moved = [tutorial, livingStories.param];

export const movedParams = {
  tutorial,
  droppedFrom: (params: URLSearchParams): URLSearchParams => {
    const kept = new URLSearchParams(params);
    moved.forEach(param => kept.delete(param));
    return kept;
  }
};
