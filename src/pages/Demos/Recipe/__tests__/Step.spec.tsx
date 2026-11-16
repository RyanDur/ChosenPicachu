import {render, screen} from '@testing-library/react';
import {Codes, DialStep, Step, StepHeading, Steps, Words} from '@pages/Demos/Recipe';

const twoSteps = () => render(<Steps>
  <Step>
    <StepHeading title="Open a gap"/>
    <Words><p>the gap opens</p></Words>
    <Codes><p>gap code</p></Codes>
  </Step>
  <DialStep>
    <StepHeading title="Slide out"/>
    <Words><p>the panel slides</p></Words>
    <Codes><p>slide code</p></Codes>
  </DialStep>
</Steps>);

describe('a step', () => {
  test('names its words by its heading', () => {
    twoSteps();

    expect(screen.getByRole('article', {name: 'Slide out'})).toHaveTextContent('the panel slides');
  });

});
