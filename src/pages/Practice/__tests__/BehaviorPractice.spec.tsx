import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {practiceAt, practicePage} from '@pages/Practice/__test_support/practice';
import {momentAddress} from '@pages/Record/MomentLink';

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

  test('should send the sequence of events to Martin Fowler’s Event Sourcing', async () => {
    render(<TestApp at={practiceAt('behavior')}/>);
    await practicePage.arrivedOn('Behavior');

    expect(practicePage.link(/Capture all changes to an application state as a sequence of events/))
      .toHaveAttribute('href', 'https://martinfowler.com/eaaDev/EventSourcing.html');
  });

  test('should send CustomEvent to MDN', async () => {
    render(<TestApp at={practiceAt('behavior')}/>);
    await practicePage.arrivedOn('Behavior');

    expect(practicePage.link('CustomEvent'))
      .toHaveAttribute('href', 'https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent');
  });
});
