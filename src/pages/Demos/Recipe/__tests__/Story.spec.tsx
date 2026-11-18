import {TestApp} from '@__test_support/TestApp';
import {appAddress} from '@__test_support/address';
import {render, waitFor} from '@testing-library/react';
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

  test('a story its page draws open is open as it first renders', () => {
    render(<TestApp at="/"><Stories>
      <Story id="told" open can="The reader can read the story at once" soThat="nothing waits on a press">
        <p>the story</p>
      </Story>
    </Stories></TestApp>);

    expect(card('The reader can read the story at once')).toHaveAttribute('open');
  });

  test('a story its page draws open closes on one press and leaves the address as it was', async () => {
    render(<TestApp at="/?world=vanilla"><Stories>
      <Story id="told" open can="The reader can read the story at once" soThat="nothing waits on a press">
        <p>the story</p>
      </Story>
    </Stories></TestApp>);

    await recipeFolds.press(document.body, 'The reader can read the story at once');

    expect(card('The reader can read the story at once')).not.toHaveAttribute('open');
    expect(appAddress.shown()).toBe('/?world=vanilla');
  });

  test('a story that keeps no record starts closed unless its page draws it open', () => {
    render(<TestApp at="/"><Stories>
      <Story id="told" can="The reader can open the story" soThat="the page stays short">
        <p>the story</p>
      </Story>
    </Stories></TestApp>);

    expect(card('The reader can open the story')).not.toHaveAttribute('open');
  });
});
