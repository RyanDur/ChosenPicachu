import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {demoPage, demosAt} from '@pages/Demos/__test_support';
import {ClassGloss} from '../ClassGloss';

describe('the gloss of class', () => {
  test('should send class to the accordions part that teaches it, by the part’s title', () => {
    render(<TestApp at="/"><p><ClassGloss/></p></TestApp>);

    expect(demoPage.signpost('A box remembers the fold, and a rule reads it'))
      .toHaveAttribute('href', demosAt('accordions/a-box-remembers-the-fold'));
  });

  test('should send rules to the accordions tab’s fold choices, with the query carried', () => {
    render(<TestApp at="/?type=inclusive"><p><ClassGloss/></p></TestApp>);

    expect(demoPage.signpost('rules'))
      .toHaveAttribute('href', `${demosAt('accordions', '?type=inclusive')}#fold-choices-heading`);
  });
});
