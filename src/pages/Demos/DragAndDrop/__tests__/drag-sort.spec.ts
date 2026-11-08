import {describe, expect, it} from 'vitest';
import {dragSort} from '../drag-sort';
import {dragSortChange} from '../drag-sort-change';

describe('a landed drag', () => {
  const resting = dragSort.initial({items: ['A', 'B', 'C'], animated: false});

  it('an item dropped on its own place is not a move', () => {
    const lifted = dragSort.reduce(resting, dragSortChange.lifted('B'));
    const hovered = dragSort.reduce(lifted, dragSortChange.hovered(1));

    expect(dragSort.reduce(hovered, dragSortChange.released()).lastMove.orNull()).toBeNull();
  });

  it('a release with nothing landed is not a move', () => {
    const lifted = dragSort.reduce(resting, dragSortChange.lifted('A'));

    expect(dragSort.reduce(lifted, dragSortChange.released()).lastMove.orNull()).toBeNull();
  });

  it('a release with nothing lifted is not a move', () => {
    const hovered = dragSort.reduce(resting, dragSortChange.hovered(2));

    expect(dragSort.reduce(hovered, dragSortChange.released()).lastMove.orNull()).toBeNull();
  });
});
