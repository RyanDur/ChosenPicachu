import {TestApp} from '@__test_support/TestApp';
import {appAddress} from '@__test_support/address';
import {act, render, waitFor} from '@testing-library/react';
import {Link} from 'react-router';
import {Step, StepHeading, Steps, Stories, Story} from '@pages/Demos/Recipe';
import {recipeFolds} from '@pages/Demos/Recipe/__test_support';

const card = (title: string): HTMLElement => recipeFolds.story(document.body, title);

describe('a story card', () => {
  test('counts the steps its build lists', () => {
    render(<TestApp at="/"><Stories>
      <Story param="tale" id="told" can="The reader can follow two steps" soThat="the build is short">
        <Steps>
          <Step>
            <StepHeading title="First"/>one</Step>
          <Step>
            <StepHeading title="Second"/>two</Step>
        </Steps>
      </Story>
    </Stories></TestApp>);

    expect(recipeFolds.tally(card('The reader can follow two steps'))).toHaveTextContent(/^2 steps$/);
  });

  test('with one step says 1 step', () => {
    render(<TestApp at="/"><Stories>
      <Story param="tale" id="told" can="The reader can follow one step" soThat="the build is shortest">
        <Steps>
          <Step>
            <StepHeading title="Only"/>one</Step>
        </Steps>
      </Story>
    </Stories></TestApp>);

    expect(recipeFolds.tally(card('The reader can follow one step'))).toHaveTextContent(/^1 step$/);
  });

  test('with no build shows no step tally', () => {
    render(<TestApp at="/"><Stories>
      <Story param="tale" id="told" can="The reader can read prose alone" soThat="nothing is built">
        <p>prose alone</p>
      </Story>
    </Stories></TestApp>);

    expect(recipeFolds.queryTally(card('The reader can read prose alone'))).not.toBeInTheDocument();
  });

  test('a story that arrival opened closes on one press', async () => {
    render(<TestApp at="/#told-first"><Stories>
      <Story param="tale" id="told" can="The reader can arrive at a step" soThat="a link can point inside a story">
        <Steps>
          <Step id="told-first">
            <StepHeading title="First"/>one</Step>
        </Steps>
      </Story>
    </Stories></TestApp>);
    await waitFor(() => expect(card('The reader can arrive at a step')).toHaveAttribute('open'));
    await waitFor(() => expect(appAddress.search()).toHaveTextContent('tale=told'));

    await recipeFolds.press(document.body, 'The reader can arrive at a step');

    expect(card('The reader can arrive at a step')).not.toHaveAttribute('open');
  });

  test('a reader sent to a step inside a closed story lands on the step and keeps its fragment', async () => {
    render(<TestApp at="/#told-first"><Stories>
      <Story param="tale" id="told" can="The reader can arrive at a step" soThat="a link can point inside a story">
        <Steps>
          <Step id="told-first">
            <StepHeading title="First"/>one</Step>
        </Steps>
      </Story>
    </Stories></TestApp>);

    await waitFor(() => expect(recipeFolds.stepHeaded(document.body, 'First')).toHaveFocus());
    expect(appAddress.fragment()).toBe('#told-first');
  });

  test('a reader who presses a story keeps the fragment they arrived by', async () => {
    render(<TestApp at="/#told-first"><Stories>
      <Story param="tale" id="told" can="The reader can arrive at a step" soThat="a link can point inside a story">
        <Steps>
          <Step id="told-first">
            <StepHeading title="First"/>one</Step>
        </Steps>
      </Story>
      <Story param="tale" id="next" can="The reader can open the next story" soThat="reading goes on">
        <p>the next story</p>
      </Story>
    </Stories></TestApp>);
    await waitFor(() => expect(appAddress.search()).toHaveTextContent('tale=told'));

    await recipeFolds.press(document.body, 'The reader can open the next story');

    await waitFor(() => expect(appAddress.search()).toHaveTextContent('next'));
    expect(appAddress.fragment()).toBe('#told-first');
  });

  test('a press on a story drawn closed opens it, though a followed link has opened it before the page caught up', async () => {
    render(<TestApp at="/"><Stories>
      <Link to={{search: '?tale=told', hash: '#tale-told-story'}}>the tale below</Link>
      <Story param="tale" id="told" can="The reader can open a story a link opened" soThat="a press answers what they saw">
        <p>the told story</p>
      </Story>
    </Stories></TestApp>);
    await appAddress.drawn();

    await act(async () => {
      await appAddress.follow('the tale below');
      await recipeFolds.press(document.body, 'The reader can open a story a link opened');
    });

    expect(appAddress.search()).toHaveTextContent('tale=told');
    expect(appAddress.fragment()).toBe('#tale-told-story');
  });

  test('a press that closes a story stays closed when the fold reports its last opening late', async () => {
    render(<TestApp at="/?tale=told"><Stories>
      <Story param="tale" id="told" can="The reader can close a story at once" soThat="a late report never reopens it">
        <p>the told story</p>
      </Story>
    </Stories></TestApp>);
    await appAddress.drawn();
    const fold = card('The reader can close a story at once');

    await act(async () => {
      await recipeFolds.press(document.body, 'The reader can close a story at once');
      fold.dispatchEvent(new Event('toggle'));
    });

    expect(appAddress.search()).not.toHaveTextContent('tale=told');
  });
});
