import {describe, expect, it} from 'vitest';
import {dragSort} from '../drag-sort';
import {dragSortChange} from '../drag-sort-change';
import {slideStarts} from '../slide-starts';

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

describe('a drag that leaves', () => {
  const resting = dragSort.initial({items: ['A', 'B', 'C'], animated: false});

  it('a drag that leaves the list before release is not a move', () => {
    const lifted = dragSort.reduce(resting, dragSortChange.lifted('A'));
    const hovered = dragSort.reduce(lifted, dragSortChange.hovered(2));
    const left = dragSort.reduce(hovered, dragSortChange.left());

    expect(dragSort.reduce(left, dragSortChange.released()).lastMove.orNull()).toBeNull();
  });
});

describe('a keyboard step', () => {
  const resting = dragSort.initial({items: ['A', 'B', 'C'], animated: true});

  it('an item stepped past the end of the list stays where it is', () => {
    expect(dragSort.reduce(resting, dragSortChange.stepped('C', 1)).order).toEqual(['A', 'B', 'C']);
  });

  it('an item still sliding ignores another step', () => {
    const stepped = dragSort.reduce(resting, dragSortChange.stepped('A', 1));

    expect(dragSort.reduce(stepped, dragSortChange.stepped('A', 1)).order).toEqual(['B', 'A', 'C']);
  });

  it('a step into a neighbour still sliding is ignored', () => {
    const stepped = dragSort.reduce(resting, dragSortChange.stepped('A', 1));

    expect(dragSort.reduce(stepped, dragSortChange.stepped('C', -1)).order).toEqual(['B', 'A', 'C']);
  });
});

describe('a crossing', () => {
  const resting = dragSort.initial({items: ['A', 'B', 'C'], animated: true});

  it('a crossing over an item still sliding is ignored', () => {
    const lifted = dragSort.reduce(resting, dragSortChange.lifted('A'));
    const crossed = dragSort.reduce(lifted, dragSortChange.crossed(1, false));

    expect(dragSort.reduce(crossed, dragSortChange.crossed(0, true)).order).toEqual(['B', 'A', 'C']);
  });

  it('a neighbour still sliding keeps its slide while the carried item crosses the next one', () => {
    const lifted = dragSort.reduce(resting, dragSortChange.lifted('A'));
    const pastB = dragSort.reduce(lifted, dragSortChange.crossed(1, false));
    const pastC = dragSort.reduce(pastB, dragSortChange.crossed(2, false));

    expect(slideStarts.of(pastC.slideStarts, 'B').isNothing).toBe(false);
  });

  it('a slide that ends leaves the other slides running', () => {
    const lifted = dragSort.reduce(resting, dragSortChange.lifted('A'));
    const pastB = dragSort.reduce(lifted, dragSortChange.crossed(1, false));
    const pastC = dragSort.reduce(pastB, dragSortChange.crossed(2, false));

    expect(slideStarts.of(dragSort.reduce(pastC, dragSortChange.slid('C')).slideStarts, 'B').isNothing).toBe(false);
  });
});
