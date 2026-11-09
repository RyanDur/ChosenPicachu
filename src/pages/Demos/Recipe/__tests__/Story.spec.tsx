import {TestApp} from '@__test_support/TestApp';
import {render, waitFor} from '@testing-library/react';
import {Step, Steps, Stories, Story} from '@pages/Demos/Recipe';
import {recipeFolds} from '@pages/Demos/Recipe/__test_support';

const card = (title: string): HTMLElement => recipeFolds.story(document.body, title);

describe('a story card', () => {
  test('counts the steps its build lists', () => {
    render(<TestApp at="/"><Stories>
      <Story param="tale" id="told" can="The reader can follow two steps" soThat="the build is short">
        <Steps>
          <Step title="First">one</Step>
          <Step title="Second">two</Step>
        </Steps>
      </Story>
    </Stories></TestApp>);

    expect(recipeFolds.tallyOf(card('The reader can follow two steps'))).toBe('2 steps');
  });

  test('with one step says 1 step', () => {
    render(<TestApp at="/"><Stories>
      <Story param="tale" id="told" can="The reader can follow one step" soThat="the build is shortest">
        <Steps>
          <Step title="Only">one</Step>
        </Steps>
      </Story>
    </Stories></TestApp>);

    expect(recipeFolds.tallyOf(card('The reader can follow one step'))).toBe('1 step');
  });

  test('with no build shows no step tally', () => {
    render(<TestApp at="/"><Stories>
      <Story param="tale" id="told" can="The reader can read prose alone" soThat="nothing is built">
        <p>prose alone</p>
      </Story>
    </Stories></TestApp>);

    expect(recipeFolds.tallyOf(card('The reader can read prose alone'))).toBeUndefined();
  });

  test('a story that arrival opened closes on one press', async () => {
    render(<TestApp at="/#told-first"><Stories>
      <Story param="tale" id="told" can="The reader can arrive at a step" soThat="a link can point inside a story">
        <Steps>
          <Step title="First" id="told-first">one</Step>
        </Steps>
      </Story>
    </Stories></TestApp>);
    await waitFor(() => expect(card('The reader can arrive at a step')).toHaveAttribute('open'));

    await recipeFolds.press(document.body, 'The reader can arrive at a step');

    expect(card('The reader can arrive at a step')).not.toHaveAttribute('open');
  });
});
