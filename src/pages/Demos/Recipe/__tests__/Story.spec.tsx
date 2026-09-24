import {TestApp} from '@__test_support/TestApp';
import {render, within} from '@testing-library/react';
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

    expect(within(card('The reader can follow two steps')).getByText('2 steps')).toBeVisible();
  });

  test('with no build shows no step tally', () => {
    render(<TestApp at="/"><Stories>
      <Story param="tale" id="told" can="The reader can read prose alone" soThat="nothing is built">
        <p>prose alone</p>
      </Story>
    </Stories></TestApp>);

    expect(within(card('The reader can read prose alone')).queryByText(/\d+ steps?/)).not.toBeInTheDocument();
  });
});
