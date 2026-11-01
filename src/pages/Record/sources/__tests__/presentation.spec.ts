import {presentation} from '../presentation';

describe('the Presentation shelf’s sources', () => {
  test('should name each source once, by its address', () => {
    const addresses = Object.values(presentation).map(({address}) => address);

    expect(new Set(addresses).size).toBe(addresses.length);
  });
});
