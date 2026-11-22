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

  test('a chart is dealt with the period chosen for it, and the hour when none was', () => {
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

  test('a name the desk does not know is left out as it was typed', () => {
    expect(desk.leftOut('pie,bogus:day')).toEqual([{why: 'unknown', entry: 'bogus:day'}]);
  });

  test('a chart named again is left out by its kind', () => {
    expect(desk.leftOut('pie,pie:week')).toEqual([{why: 'repeat', kind: 'pie'}]);
  });

  test('an empty entry is not told as left out', () => {
    expect(desk.leftOut('pie,,candles')).toEqual([]);
  });

  test('an entry of only spaces is not told as left out', () => {
    expect(desk.leftOut('pie, ,candles')).toEqual([]);
  });

  test('a chart named with a space beside its comma is dealt', () => {
    expect(desk.dealt('pie, candles').map(({kind}) => kind)).toEqual(['pie', 'candles']);
  });

  test('a chart named with a space beside its comma is not told as left out', () => {
    expect(desk.leftOut('pie, candles')).toEqual([]);
  });

  test('a name the desk does not know is told without the spaces around it', () => {
    expect(desk.leftOut('pie, bogus ')).toEqual([{why: 'unknown', entry: 'bogus'}]);
  });

  test('an address naming no chart it knows is told the price line stands in', () => {
    expect(desk.leftOut('bogus')).toEqual([{why: 'unknown', entry: 'bogus'}, {why: 'none seated'}]);
  });

  test('an address naming no chart at all tells nothing', () => {
    expect(desk.leftOut(',')).toEqual([]);
  });

  test('a chart named again and again is told as left out once', () => {
    expect(desk.leftOut('pie,pie,pie')).toEqual([{why: 'repeat', kind: 'pie'}]);
  });

  test('a name the desk does not know, given again, is told as left out once', () => {
    expect(desk.leftOut('bogus,pie,bogus')).toEqual([{why: 'unknown', entry: 'bogus'}]);
  });

  test('what was left out is told in the order the address gives it', () => {
    expect(desk.leftOut('pie,pie,bogus')).toEqual([{why: 'repeat', kind: 'pie'}, {why: 'unknown', entry: 'bogus'}]);
  });

  test('an address naming each chart once leaves nothing out', () => {
    expect(desk.leftOut('pie,candles:day')).toEqual([]);
  });

  test('a period the page does not have is told as it was typed', () => {
    expect(desk.leftOut('candles:decade')).toEqual([{why: 'unknown period', kind: 'candles', period: 'decade'}]);
  });

  test('a chart with a period the page does not have is still dealt, by the hour', () => {
    expect(desk.dealt('candles:decade')).toEqual([{kind: 'candles', period: Period.hour}]);
  });

  test('a period given in another case is told as it was typed', () => {
    expect(desk.leftOut('candles:Day')).toEqual([{why: 'unknown period', kind: 'candles', period: 'Day'}]);
  });

  test('a colon with no period after it is not told', () => {
    expect(desk.leftOut('candles:')).toEqual([]);
  });

  test('a period the page does not have, given on two charts, is told for each', () => {
    expect(desk.leftOut('candles:decade,price:decade')).toEqual([
      {why: 'unknown period', kind: 'candles', period: 'decade'},
      {why: 'unknown period', kind: 'price', period: 'decade'}
    ]);
  });

  test('a chart given again with its unknown period is told as a repeat', () => {
    expect(desk.leftOut('candles:decade,candles:decade'))
      .toEqual([{why: 'unknown period', kind: 'candles', period: 'decade'}, {why: 'repeat', kind: 'candles'}]);
  });

  test('a period given to a chart that has none is told', () => {
    expect(desk.leftOut('pie:day')).toEqual([{why: 'no periods', kind: 'pie'}]);
  });

  test('a chart that has no periods is still dealt when given one', () => {
    expect(desk.dealt('pressure:day')).toEqual([{kind: 'pressure', period: Period.hour}]);
  });

  test('a chart with no periods is told so once, however many periods it is given', () => {
    expect(desk.leftOut('pie:day,pie:week')).toEqual([{why: 'no periods', kind: 'pie'}, {why: 'repeat', kind: 'pie'}]);
  });

  test('a chart with no periods, named with no period, is not told', () => {
    expect(desk.leftOut('pie,pressure:')).toEqual([]);
  });

  test('a period with a space beside its colon is dealt as that period', () => {
    expect(desk.dealt('candles: day')).toEqual([{kind: 'candles', period: Period.day}]);
  });

  test('a period with a space beside its colon is not told as left out', () => {
    expect(desk.leftOut('candles: day')).toEqual([]);
  });

  test('a chart named with a space before its colon is dealt with its period', () => {
    expect(desk.dealt('candles :day')).toEqual([{kind: 'candles', period: Period.day}]);
  });

  test('a chart named with a space before its colon is not told as left out', () => {
    expect(desk.leftOut('candles :day')).toEqual([]);
  });

  test('a period with a second colon in it is told whole, as it was typed', () => {
    expect(desk.leftOut('candles:day:week')).toEqual([{why: 'unknown period', kind: 'candles', period: 'day:week'}]);
  });

  test('a chart with a second colon in its period is still dealt, by the hour', () => {
    expect(desk.dealt('candles:day:week')).toEqual([{kind: 'candles', period: Period.hour}]);
  });

  test('a name the desk does not know is told even when it reads like a period another chart was given', () => {
    expect(desk.leftOut('candles:decade,period candles decade')).toEqual([
      {why: 'unknown period', kind: 'candles', period: 'decade'},
      {why: 'unknown', entry: 'period candles decade'}
    ]);
  });
});
