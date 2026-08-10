import {render, screen} from '@testing-library/react';
import {bucketPressure, pressureShapes} from '@pages/Demos/Charts/Pressure/shapes';
import {Pressure} from '@pages/Demos/Charts/Pressure';
import {bitcoin} from '@pages/Demos/Charts/money';
import {Trade} from '@pages/Demos/Charts/coinbase';

const trade = (overrides: Partial<Trade>): Trade =>
  ({id: 1, price: 65000, tradedAt: 1700000000000, size: 1, side: 'buy', ...overrides});

describe('pressure', () => {
  test('trades bucket by window, split by side', () => {
    expect(bucketPressure([
      trade({tradedAt: 60000, size: 2, side: 'buy'}),
      trade({id: 2, tradedAt: 61000, size: 1, side: 'sell'}),
      trade({id: 3, tradedAt: 120000, size: 3, side: 'sell'})
    ], 60000)).toEqual([
      {openedAt: 60000, bought: 2, sold: 1},
      {openedAt: 120000, bought: 0, sold: 3}
    ]);
  });

  test('the heaviest side sets one scale for both directions', () => {
    const shapes = pressureShapes([
      {openedAt: 0, bought: 4, sold: 2},
      {openedAt: 60000, bought: 1, sold: 0}
    ], 240, 100, 60000);

    expect(shapes[0].boughtTop).toBe(0);
    expect(shapes[0].boughtHeight).toBe(50);
    expect(shapes[0].soldTop).toBe(50);
    expect(shapes[0].soldHeight).toBe(25);
    expect(shapes[1].boughtHeight).toBe(12.5);
    expect(shapes[1].soldHeight).toBe(0);
  });

  test('the card bars the sides around the midline', () => {
    render(<Pressure trades={[
      trade({size: 2, side: 'buy'}),
      trade({id: 2, tradedAt: 1700000001000, size: 1, side: 'sell'})
    ]}/>);

    const card = screen.getByRole('region', {name: 'pressure'});
    expect(card.querySelectorAll('rect.bought')).toHaveLength(1);
    expect(card.querySelectorAll('rect.sold')).toHaveLength(1);
    expect(card.querySelectorAll('rect.bought-wall')).toHaveLength(1);
    expect(card.querySelectorAll('rect.sold-wall')).toHaveLength(1);
    expect(card).toHaveTextContent('since you arrived');
    expect(card).toHaveTextContent('1 window ·');
    expect(card).toHaveTextContent('2 BTC');
    expect(card).toHaveTextContent('-2 BTC');
  });

  test('the axis speaks tiny sizes instead of rounding them to nothing', () => {
    expect(bitcoin(0.0042)).toBe('0.0042 BTC');
    expect(bitcoin(12.63)).toBe('12.6 BTC');
    expect(bitcoin(0)).toBe('0 BTC');
  });

  test('an empty stream leaves the card waiting, not broken', () => {
    render(<Pressure trades={[]}/>);

    const card = screen.getByRole('region', {name: 'pressure'});
    expect(card.querySelectorAll('rect')).toHaveLength(0);
    expect(card).toHaveTextContent('waiting for the first trade');
  });
});
