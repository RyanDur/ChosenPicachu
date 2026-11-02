import {recordListing} from '../listing';

test('should count the moments in the Record’s description, so a moment added is a moment counted', () => {
  expect(recordListing(23).description).toContain('in twenty-three moments from 1989 on');
});
