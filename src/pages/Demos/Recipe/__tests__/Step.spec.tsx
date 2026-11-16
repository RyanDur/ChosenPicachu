import {render} from '@testing-library/react';
import {Codes, DialStep, Step, StepHeading, Steps, Words} from '@pages/Demos/Recipe';
import {recipeSteps} from '@pages/Demos/Recipe/__test_support';

describe('a step', () => {
  test('names its words by its heading', () => {
    render(<Steps>
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

    expect(recipeSteps.words('Slide out')).toHaveTextContent('the panel slides');
  });

  test('names its code by its heading', () => {
    render(<Steps>
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

    expect(recipeSteps.code('Open a gap')).toHaveTextContent('gap code');
  });
});
