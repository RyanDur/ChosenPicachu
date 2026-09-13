import {equalAddresses} from '../addresses';
import {createAddress} from '@components/Users/resource/usersApi';

describe('working from home means every part of both addresses matches', () => {
  const home = createAddress();

  test('two addresses matching in every part are equal', () => {
    expect(equalAddresses(home, {...home})).toBe(true);
  });

  test('a different street in the same zip is a different address', () => {
    expect(equalAddresses(home, {...home, streetAddress: `${home.streetAddress} apt 2`})).toBe(false);
  });

  test('a missing work address is not the home address', () => {
    expect(equalAddresses(home, undefined)).toBe(false);
  });
});
