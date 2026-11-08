import {desk} from '@pages/Demos/Charts/desk';
import {Period} from '@pages/Demos/Market';

describe('the desk', () => {
  test('the desk deals one of each kind', () => {
    expect(desk.dealt('candles,price,price').map(({kind}) => kind)).toEqual(['candles', 'price']);
  });

  test('an empty desk deals the price line', () => {
    expect(desk.dealt('')).toEqual([{kind: 'price', period: Period.hour}]);
  });

  test('an unknown kind is never dealt', () => {
    expect(desk.dealt('bogus,pie').map(({kind}) => kind)).toEqual(['pie']);
  });

  test('a chart is desk.dealt with the period chosen for it, and the hour when none was', () => {
    expect(desk.dealt('price:day,candles')).toEqual([{kind: 'price', period: Period.day}, {kind: 'candles', period: Period.hour}]);
  });

  test('a period nobody offers falls back to the hour', () => {
    expect(desk.dealt('price:fortnight')).toEqual([{kind: 'price', period: Period.hour}]);
  });

  test('a chosen period is written beside its chart, and the hour is left unsaid', () => {
    expect(desk.periodChosen('price', Period.day, desk.dealt('price,candles:week'))).toBe('price:day,candles:week');
    expect(desk.periodChosen('candles', Period.hour, desk.dealt('price:day,candles:week'))).toBe('price:day,candles');
  });

  test('a period chosen for a chart the desk does not hold seats that chart', () => {
    expect(desk.periodChosen('candles', Period.day, desk.dealt('price'))).toBe('price,candles:day');
  });

  test('a new chart goes to the front of the list', () => {
    expect(desk.added('pie', desk.dealt('price:day,candles'))).toBe('pie,price:day,candles');
  });

  test('a removed chart leaves its seat', () => {
    expect(desk.without(1, desk.dealt('price,candles,pie'))).toBe('price,pie');
  });

  test('a reseated chart moves, the rest close ranks', () => {
    expect(desk.seated(0, 2, desk.dealt('price:day,candles,pie'))).toBe('candles,pie,price:day');
  });

  test('the menu offers only what is absent', () => {
    expect(desk.absent(desk.dealt('price,pie'))).toEqual(['candles', 'pressure']);
  });
});
