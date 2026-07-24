import {equalAddresses} from '../addresses';
import {createAddress} from '@components/Users/resource/usersApi';

describe('working from home means every part of both addresses matches', () => {
  const home = createAddress();

  test('the same address on both sides', () => {
    expect(equalAddresses(home, {...home})).toBe(true);
  });

  test('a different street in the same zip is a different address', () => {
    expect(equalAddresses(home, {...home, streetAddress: `${home.streetAddress} apt 2`})).toBe(false);
  });

  test('no work address at all', () => {
    expect(equalAddresses(home, undefined)).toBe(false);
  });
});
