import {render, screen} from '@testing-library/react';
import {bucketPressure, pressureShapes} from '@pages/Demos/Charts/Pressure/shapes';
import {Pressure} from '@pages/Demos/Charts/Pressure';
import {bitcoin} from '@pages/Demos/Charts/money';
import {aTrade, bought, sold} from '@pages/Demos/Charts/__test_support';

describe('pressure', () => {
  test('should count a trade Coinbase marks sell as bought, since its waiting order was the seller and a buyer took it', () => {
    expect(bucketPressure([
      aTrade({tradedAt: 60000, size: 2, side: 'sell'}),
      aTrade({id: 2, tradedAt: 61000, size: 5, side: 'buy'})
    ], 60000)).toEqual([{openedAt: 60000, bought: 2, sold: 5}]);
  });

  test('trades bucket by window, split by side', () => {
    expect(bucketPressure([
      bought(2, {tradedAt: 60000}),
      sold(1, {id: 2, tradedAt: 61000}),
      sold(3, {id: 3, tradedAt: 120000})
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
      bought(2),
      sold(1, {id: 2, tradedAt: 1700000001000})
    ]}/>);

    const card = screen.getByRole('region', {name: 'pressure'});
    expect(card).toHaveTextContent('since you arrived');
    expect(card).toHaveTextContent('1 window ·');
    expect(card).toHaveTextContent('2 BTC');
    expect(card).toHaveTextContent('-2 BTC');
  });

  test('a size under a whole unit keeps its digits', () => {
    expect(bitcoin(0.0042)).toBe('0.0042 BTC');
  });

  test('a larger size rounds to one decimal', () => {
    expect(bitcoin(12.63)).toBe('12.6 BTC');
    expect(bitcoin(0)).toBe('0 BTC');
  });

  test('an empty stream leaves the card waiting, not broken', () => {
    render(<Pressure trades={[]}/>);

    const card = screen.getByRole('region', {name: 'pressure'});
    expect(card).not.toHaveTextContent('window');
    expect(card).toHaveTextContent('waiting for the first trade');
  });

  test('an empty stream draws no scale beside the empty chart', () => {
    render(<Pressure trades={[]}/>);

    expect(screen.getByRole('region', {name: 'pressure'})).not.toHaveTextContent('BTC');
  });

  test('should explain bought and sold by who came and took the trade', () => {
    render(<Pressure trades={[]}/>);

    expect(screen.getByRole('region', {name: 'pressure'})).toHaveTextContent('When the one that came was a buyer, the trade counts as bought. When it was a seller, it counts as sold.');
  });
});
