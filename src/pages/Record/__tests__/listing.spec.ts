import {listing} from '../listing';

test("the Record's description names a count of a hundred or more in numerals", () => {
  expect(listing.ofRecord(100).description).toContain('in 100 moments');
});
