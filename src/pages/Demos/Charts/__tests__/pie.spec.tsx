import {render, screen} from '@testing-library/react';
import {explodedBy, sideTotals, slices, sweepGates} from '@pages/Demos/Charts/Pie/shapes';
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

  test('a share opens its gates in degrees', () => {
    const [threeQuarters, quarter] = slices([3, 1]);

    expect(sweepGates(threeQuarters)).toEqual({opening: 0, closing: 90});
    expect(sweepGates(quarter)).toEqual({opening: -90, closing: 0});
  });

  test('a slice explodes along its own middle', () => {
    const [rightHalf] = slices([1, 1]);

    const {dx, dy} = explodedBy(rightHalf, 4);

    expect(dx).toBeCloseTo(4);
    expect(dy).toBeCloseTo(0);
  });

  test('the card cuts the session into a bought and a sold slice, and says each share', () => {
    render(<Pie trades={[
      trade({size: 3, side: 'buy'}),
      trade({id: 2, size: 1, side: 'sell'})
    ]}/>);

    const card = screen.getByRole('region', {name: 'pie'});
    expect(card).toHaveTextContent('75% bought');
    expect(card).toHaveTextContent('25% sold');
  });

  test('the card says the session started when the trader arrived', () => {
    render(<Pie trades={[trade({size: 3, side: 'buy'})]}/>);

    expect(screen.getByRole('region', {name: 'pie'})).toHaveTextContent('since you arrived');
  });

  test('a one-sided session opens both gates fully', () => {
    expect(sweepGates(slices([2, 0])[0])).toEqual({opening: 0, closing: 180});
  });

  test('the card reads a one-sided session as all bought', () => {
    render(<Pie trades={[trade({size: 2, side: 'buy'})]}/>);

    const card = screen.getByRole('region', {name: 'pie'});
    expect(card).toHaveTextContent('100% bought');
    expect(card).toHaveTextContent('0% sold');
  });

  test('an empty stream leaves the card waiting, not broken', () => {
    render(<Pie trades={[]}/>);

    const card = screen.getByRole('region', {name: 'pie'});
    expect(card).not.toHaveTextContent('%');
    expect(card).toHaveTextContent('waiting for the first trade');
  });
});
