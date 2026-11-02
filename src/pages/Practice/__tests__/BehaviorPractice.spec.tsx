import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {practiceAt, practicePage} from '@pages/Practice/__test_support/practice';
import {momentAddress} from '@pages/Record/MomentLink';
import {outOfReadingOrder} from '@__test_support/reading-order';

const oneDirection = 'One direction. An event goes to the reducer, the reducer returns the next state, the page is drawn from the state, and the page sends the next event. The shell, drawn apart, holds the state and runs the loop, and nothing inside the loop knows the shell is there.';

describe('the Behavior practice tab', () => {
  test('should send the one direction to the July 2014 moment', async () => {
    render(<TestApp at={practiceAt('behavior')}/>);
    await practicePage.arrivedOn('Behavior');

    expect(practicePage.link('July 2014 moment')).toHaveAttribute('href', momentAddress('oneDirection'));
  });

  test('should open the Behavior tab from its address', async () => {
    render(<TestApp at={practiceAt('behavior')}/>);

    expect(await practicePage.arrivedOn('Behavior')).toBeInTheDocument();
    expect(practicePage.currentTab()).toBe('Behavior');
  });

  test('should send operable through a keyboard interface to the W3C, under the heading how I organize it', async () => {
    render(<TestApp at={practiceAt('behavior')}/>);
    await practicePage.arrivedOn('Behavior');

    expect(practicePage.heading()).toBeVisible();
    expect(practicePage.link(/operable through a keyboard interface/))
      .toHaveAttribute('href', expect.stringContaining('w3.org'));
  });

  test('should draw one direction after the table’s reducer', async () => {
    render(<TestApp at={practiceAt('behavior')}/>);
    await practicePage.arrivedOn('Behavior');

    expect(outOfReadingOrder([
      practicePage.figure('DragSortableTable/reducer.ts on GitHub'),
      practicePage.figure(oneDirection)
    ])).toEqual([]);
  });

  test('should keep the one-direction drawing from a screen reader', async () => {
    render(<TestApp at={practiceAt('behavior')}/>);
    await practicePage.arrivedOn('Behavior');

    expect(practicePage.imagesHeardIn(oneDirection)).toEqual([]);
  });

  test('should send the sequence of events to Martin Fowler’s Event Sourcing', async () => {
    render(<TestApp at={practiceAt('behavior')}/>);
    await practicePage.arrivedOn('Behavior');

    expect(practicePage.link(/Capture all changes to an application state as a sequence of events/))
      .toHaveAttribute('href', 'https://martinfowler.com/eaaDev/EventSourcing.html');
  });

  test('should send schemawax and its own description to its repository', async () => {
    render(<TestApp at={practiceAt('behavior')}/>);
    await practicePage.arrivedOn('Behavior');

    expect(practicePage.link('schemawax')).toHaveAttribute('href', 'https://github.com/michaljanocko/schemawax');
    expect(practicePage.link(/Tiny typed data decoder/)).toHaveAttribute('href', 'https://github.com/michaljanocko/schemawax');
  });

  test('should send CustomEvent to MDN', async () => {
    render(<TestApp at={practiceAt('behavior')}/>);
    await practicePage.arrivedOn('Behavior');

    expect(practicePage.link('CustomEvent'))
      .toHaveAttribute('href', 'https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent');
  });
});
