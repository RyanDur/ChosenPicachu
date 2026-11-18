const tutorial = 'tut';
const living = 'living';
const moved = [tutorial, living];

export const movedParams = {
  tutorial,
  living,
  droppedFrom: (params: URLSearchParams): URLSearchParams => {
    const kept = new URLSearchParams(params);
    moved.forEach(param => kept.delete(param));
    return kept;
  }
};
