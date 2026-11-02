import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {practiceAt, practicePage} from '@pages/Practice/__test_support/practice';

describe('the Behavior practice tab', () => {
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
});
