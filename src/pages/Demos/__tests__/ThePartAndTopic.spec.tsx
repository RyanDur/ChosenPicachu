import {render} from '@testing-library/react';
import {MemoryRouter} from 'react-router';
import {PartOpening} from '@pages/Demos/PartOpening';
import {TabPager} from '@pages/Demos/TabPager';

describe('a piece of a demo page rendered outside the page that gives it', () => {
  test('should fail, naming the part it was not given', () => {
    expect(() => render(<PartOpening/>)).toThrow('useThePart is read outside ThePart');
  });

  test('should fail, naming the tab it was not given', () => {
    expect(() => render(<MemoryRouter><TabPager/></MemoryRouter>)).toThrow('useShownTopic is read outside ShownTopic');
  });
});
