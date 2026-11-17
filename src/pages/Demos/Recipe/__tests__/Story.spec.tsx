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

  test('a reader who follows a link to a story keeps its fragment when the fold opens before the page has caught up', async () => {
    render(<TestApp at="/"><Stories>
      <Link to={{search: '?tale=told', hash: '#tale-told-story'}}>the tale below</Link>
      <Story param="tale" id="told" can="The reader can follow a link to a story" soThat="the link lands on it">
        <p>the told story</p>
      </Story>
    </Stories></TestApp>);
    await appAddress.drawn();
    const fold = card('The reader can follow a link to a story');

    await act(async () => {
      await appAddress.follow('the tale below');
      fold.toggleAttribute('open', true);
      fold.dispatchEvent(new Event('toggle'));
    });

    await waitFor(() => expect(appAddress.search()).toHaveTextContent('tale=told'));
    expect(appAddress.fragment()).toBe('#tale-told-story');
  });

  test('a press on a story a followed link opened, before the page has caught up, closes it', async () => {
    render(<TestApp at="/"><Stories>
      <Link to={{search: '?tale=told', hash: '#tale-told-story'}}>the tale below</Link>
      <Story param="tale" id="told" can="The reader can close a story a link opened" soThat="a press always answers">
        <p>the told story</p>
      </Story>
    </Stories></TestApp>);
    await appAddress.drawn();

    await act(async () => {
      await appAddress.follow('the tale below');
      await recipeFolds.press(document.body, 'The reader can close a story a link opened');
    });

    await waitFor(() => expect(appAddress.fragment()).toBe('#tale-told-story'));
    expect(appAddress.search()).not.toHaveTextContent('tale=told');
  });
});
