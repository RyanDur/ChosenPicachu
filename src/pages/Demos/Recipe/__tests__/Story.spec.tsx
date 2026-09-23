import {TestApp} from '@__test_support/TestApp';
import {render, screen, within} from '@testing-library/react';
import {Step, Steps, Story} from '@pages/Demos/Recipe';

const card = (title: string): HTMLElement => screen.getByRole('group', {name: title});

describe('a story card', () => {
  test('counts the steps its build lists', () => {
    render(<TestApp at="/"><ol>
      <Story param="tale" id="told" can="The reader can follow two steps" soThat="the build is short">
        <Steps>
          <Step title="First">one</Step>
          <Step title="Second">two</Step>
        </Steps>
      </Story>
    </ol></TestApp>);

    expect(within(card('The reader can follow two steps')).getByText('2 steps')).toBeVisible();
  });

  test('with no build shows no step tally', () => {
    render(<TestApp at="/"><ol>
      <Story param="tale" id="told" can="The reader can read prose alone" soThat="nothing is built">
        <p>prose alone</p>
      </Story>
    </ol></TestApp>);

    expect(within(card('The reader can read prose alone')).queryByText(/\d+ steps?/)).toBeNull();
  });
});
