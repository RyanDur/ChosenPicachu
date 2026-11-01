import {presentation} from '../presentation';

describe('the Presentation shelf’s sources', () => {
  test('should name each source once, by its address', () => {
    const addresses = Object.values(presentation).map(({address}) => address);

    expect(new Set(addresses).size).toBe(addresses.length);
  });

  test('should give every source a title and a provenance', () => {
    Object.values(presentation).forEach(({title, provenance}) => {
      expect(title).not.toBe('');
      expect(provenance).not.toBe('');
    });
  });
});
