import {absent, added, dealt, seated, without} from '@pages/Demos/Charts/desk';

describe('the desk', () => {
  test('deals one of each kind, price when empty', () => {
    expect(dealt('candles,price,price')).toEqual(['candles', 'price']);
    expect(dealt('')).toEqual(['price']);
    expect(dealt('bogus,pie')).toEqual(['pie']);
  });

  test('a new chart lands under the hand', () => {
    expect(added('pie', ['price', 'candles'])).toBe('pie,price,candles');
  });

  test('a removed chart leaves its seat', () => {
    expect(without(1, ['price', 'candles', 'pie'])).toBe('price,pie');
  });

  test('a reseated chart moves, the rest close ranks', () => {
    expect(seated(0, 2, ['price', 'candles', 'pie'])).toBe('candles,pie,price');
  });

  test('the menu offers only what is absent', () => {
    expect(absent(['price', 'pie'])).toEqual(['candles', 'pressure']);
  });
});
