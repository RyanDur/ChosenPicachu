import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {demoPage} from '@pages/Demos/__test_support';
import {StorySlices} from '../StorySlices';

describe('the story slices', () => {
  test('the recipe links out to the user story', async () => {
    render(<TestApp at="/"><StorySlices/></TestApp>);

    expect(demoPage.signpost('user story')).toHaveAttribute('href', expect.stringContaining('initialcapacity.io/insights/user-story'));
  });
});
