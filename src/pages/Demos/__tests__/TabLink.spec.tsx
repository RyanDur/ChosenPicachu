import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {demoPage, demosAt} from '@pages/Demos/__test_support';
import {DemoTopics} from '@pages/Demos/demo-topics';
import {TabLink} from '../TabLink';

describe('a link to a tab', () => {
  test('should stay a link to its heading on its own tab’s page', () => {
    render(<TestApp at={demosAt('accordions')}><p><TabLink to={DemoTopics.accordions} heading="fold-choices-heading">rules</TabLink></p></TestApp>);

    expect(demoPage.signpost('rules')).toHaveAttribute('href', `${demosAt('accordions')}#fold-choices-heading`);
  });
});
