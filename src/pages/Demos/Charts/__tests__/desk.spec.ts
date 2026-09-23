import {absent, added, dealt, periodChosen, seatAfterRemoval, seated, without} from '@pages/Demos/Charts/desk';
import {Period} from '@pages/Demos/Charts/period';

describe('the desk', () => {
  test('the desk deals one of each kind', () => {
    expect(dealt('candles,price,price').map(({kind}) => kind)).toEqual(['candles', 'price']);
  });

  test('an empty desk deals the price line', () => {
    expect(dealt('')).toEqual([{kind: 'price', period: Period.hour}]);
  });

  test('an unknown kind is never dealt', () => {
    expect(dealt('bogus,pie').map(({kind}) => kind)).toEqual(['pie']);
  });

  test('a chart is dealt with the period chosen for it, and the hour when none was', () => {
    expect(dealt('price:day,candles')).toEqual([{kind: 'price', period: Period.day}, {kind: 'candles', period: Period.hour}]);
  });

  test('a period nobody offers falls back to the hour', () => {
    expect(dealt('price:fortnight')).toEqual([{kind: 'price', period: Period.hour}]);
  });

  test('a chosen period is written beside its chart, and the hour is left unsaid', () => {
    expect(periodChosen('price', Period.day, dealt('price,candles:week'))).toBe('price:day,candles:week');
    expect(periodChosen('candles', Period.hour, dealt('price:day,candles:week'))).toBe('price:day,candles');
  });

  test('a period chosen for a chart the desk does not hold seats that chart', () => {
    expect(periodChosen('candles', Period.day, dealt('price'))).toBe('price,candles:day');
  });

  test('after a removal the seat that took its place is next, or the last seat when the removed one was last', () => {
    expect(seatAfterRemoval(0, dealt('candles,pie')).map(({kind}) => kind).orNull()).toBe('candles');
    expect(seatAfterRemoval(2, dealt('candles,pie')).map(({kind}) => kind).orNull()).toBe('pie');
  });

  test('a new chart lands under the hand', () => {
    expect(added('pie', dealt('price:day,candles'))).toBe('pie,price:day,candles');
  });

  test('a removed chart leaves its seat', () => {
    expect(without(1, dealt('price,candles,pie'))).toBe('price,pie');
  });

  test('a reseated chart moves, the rest close ranks', () => {
    expect(seated(0, 2, dealt('price:day,candles,pie'))).toBe('candles,pie,price:day');
  });

  test('the menu offers only what is absent', () => {
    expect(absent(dealt('price,pie'))).toEqual(['candles', 'pressure']);
  });
});
