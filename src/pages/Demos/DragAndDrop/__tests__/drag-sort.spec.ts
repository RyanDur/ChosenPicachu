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

describe('a drop', () => {
  const resting = dragSort.initial({items: ['A', 'B', 'C'], animated: true});

  it('a drop that moves items still sliding is ignored', () => {
    const lifted = dragSort.reduce(resting, dragSortChange.lifted('A'));
    const hovered = dragSort.reduce(lifted, dragSortChange.hovered(2));
    const dropped = dragSort.reduce(hovered, dragSortChange.released());
    const liftedAgain = dragSort.reduce(dropped, dragSortChange.lifted('B'));
    const hoveredAgain = dragSort.reduce(liftedAgain, dragSortChange.hovered(2));

    expect(dragSort.reduce(hoveredAgain, dragSortChange.released()).order).toEqual(['B', 'C', 'A']);
  });

  it('a drop that would move a neighbour still sliding is ignored', () => {
    const stepped = dragSort.reduce(resting, dragSortChange.stepped('B', 1));
    const lifted = dragSort.reduce(stepped, dragSortChange.lifted('A'));
    const hovered = dragSort.reduce(lifted, dragSortChange.hovered(2));

    expect(dragSort.reduce(hovered, dragSortChange.released()).order).toEqual(['A', 'C', 'B']);
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

  it('a carried item still sliding ignores a crossing', () => {
    const pastB = dragSort.reduce(dragSort.reduce(resting, dragSortChange.lifted('A')), dragSortChange.crossed(1, false));
    const liftedWhileSliding = dragSort.reduce(dragSort.reduce(pastB, dragSortChange.released()), dragSortChange.lifted('B'));

    expect(dragSort.reduce(liftedWhileSliding, dragSortChange.crossed(1, false)).order).toEqual(['B', 'A', 'C']);
  });

  it('a crossing reported again after the carried item took that seat does not stop the carry', () => {
    const pastB = dragSort.reduce(dragSort.reduce(resting, dragSortChange.lifted('A')), dragSortChange.crossed(1, false));
    const reportedAgain = dragSort.reduce(pastB, dragSortChange.crossed(1, false));

    expect(dragSort.reduce(reportedAgain, dragSortChange.crossed(2, false)).order).toEqual(['B', 'C', 'A']);
  });

  describe('with D sliding from a step, and a carried A crossing B', () => {
    const steppedPast = dragSort.reduce(dragSort.initial({items: ['A', 'B', 'C', 'D'], animated: true}),
      dragSortChange.stepped('C', 1));
    const pastB = dragSort.reduce(dragSort.reduce(steppedPast, dragSortChange.lifted('A')), dragSortChange.crossed(1, false));

    it('the crossing leaves D sliding, so a step of D is ignored', () => {
      expect(dragSort.reduce(pastB, dragSortChange.stepped('D', -1)).order).toEqual(['B', 'A', 'D', 'C']);
    });

    it('the end of B\'s slide leaves D sliding, so a step of D is ignored', () => {
      const bSettled = dragSort.reduce(pastB, dragSortChange.slid('B'));

      expect(dragSort.reduce(bSettled, dragSortChange.stepped('D', -1)).order).toEqual(['B', 'A', 'D', 'C']);
    });
  });
});
