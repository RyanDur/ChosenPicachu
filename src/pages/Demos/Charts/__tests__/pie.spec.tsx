import {render, screen} from '@testing-library/react';
import {arcPath, sideTotals, slices} from '@pages/Demos/Charts/Pie/shapes';
import {Pie} from '@pages/Demos/Charts/Pie';
import {Trade} from '@pages/Demos/Charts/coinbase';

const trade = (overrides: Partial<Trade>): Trade =>
  ({id: 1, price: 65000, tradedAt: 1700000000000, size: 1, side: 'buy', ...overrides});

describe('the pie', () => {
  test('the session totals by side', () => {
    expect(sideTotals([
      trade({size: 2, side: 'buy'}),
      trade({id: 2, size: 1, side: 'sell'}),
      trade({id: 3, size: 3, side: 'sell'})
    ])).toEqual({bought: 2, sold: 4});
  });

  test('weights cut the circle into consecutive shares', () => {
    const cut = slices([3, 1]);

    expect(cut[0].share).toBe(0.75);
    expect(cut[0].from).toBe(0);
    expect(cut[0].to).toBeCloseTo(1.5 * Math.PI);
    expect(cut[1].share).toBe(0.25);
    expect(cut[1].from).toBeCloseTo(1.5 * Math.PI);
    expect(cut[1].to).toBeCloseTo(2 * Math.PI);
  });

  test('nothing traded cuts nothing', () => {
    expect(slices([0, 0])).toEqual([]);
  });

  test('a slice past half the circle takes the long way round', () => {
    const [long, short] = slices([3, 1]);

    expect(arcPath(60, 60, 50, long)).toContain('A 50 50 0 1 1');
    expect(arcPath(60, 60, 50, short)).toContain('A 50 50 0 0 1');
  });

  test('the card cuts the session into a bought and a sold slice', () => {
    render(<Pie trades={[
      trade({size: 3, side: 'buy'}),
      trade({id: 2, size: 1, side: 'sell'})
    ]}/>);

    const card = screen.getByRole('region', {name: 'pie'});
    expect(card.querySelectorAll('path.bought')).toHaveLength(1);
    expect(card.querySelectorAll('path.sold')).toHaveLength(1);
    expect(card).toHaveTextContent('75% bought');
    expect(card).toHaveTextContent('25% sold');
    expect(card).toHaveTextContent('since you arrived');
  });

  test('a one-sided session draws a whole circle, not a broken arc', () => {
    render(<Pie trades={[trade({size: 2, side: 'buy'})]}/>);

    const card = screen.getByRole('region', {name: 'pie'});
    expect(card.querySelectorAll('circle.bought')).toHaveLength(1);
    expect(card.querySelectorAll('path')).toHaveLength(0);
    expect(card).toHaveTextContent('100% bought');
  });

  test('an empty stream leaves the card waiting, not broken', () => {
    render(<Pie trades={[]}/>);

    const card = screen.getByRole('region', {name: 'pie'});
    expect(card.querySelectorAll('path, circle')).toHaveLength(0);
    expect(card).toHaveTextContent('waiting for the first trade');
  });
});
