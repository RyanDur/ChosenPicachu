import {render, waitFor} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {feedIsSubscribed} from '@pages/Demos/__test_support';
import {broadcast, listeningFeed, tradeFrame} from '@pages/Demos/__test_support/feed';
import {Trading} from '@pages/Demos/Market/Trading';
import {pieShapes} from '@pages/Demos/Charts/Pie/pie-shapes';
import {Pie} from '@pages/Demos/Charts/Pie';
import {bought, chartsDesk, sold} from '@pages/Demos/Charts/__test_support';

const now = 1700000000000;

describe('the pie', () => {
  test('the session totals by side', () => {
    expect(pieShapes.sideTotals([
      bought(2),
      sold(1, {id: 2}),
      sold(3, {id: 3})
    ])).toEqual({bought: 2, sold: 4});
  });

  test('weights cut the circle into consecutive shares', () => {
    const cut = pieShapes.wedges([{weight: 3}, {weight: 1}]);

    expect(cut[0].share).toBe(0.75);
    expect(cut[0].from).toBe(0);
    expect(cut[0].to).toBeCloseTo(1.5 * Math.PI);
    expect(cut[1].share).toBe(0.25);
    expect(cut[1].from).toBeCloseTo(1.5 * Math.PI);
    expect(cut[1].to).toBeCloseTo(2 * Math.PI);
  });

  test('nothing traded cuts nothing', () => {
    expect(pieShapes.wedges([{weight: 0}, {weight: 0}])).toEqual([]);
  });

  test('a share opens its gates in degrees', () => {
    const [threeQuarters, quarter] = pieShapes.wedges([{weight: 3}, {weight: 1}]);

    expect(pieShapes.sweepGates(threeQuarters)).toEqual({opening: 0, closing: 90});
    expect(pieShapes.sweepGates(quarter)).toEqual({opening: -90, closing: 0});
  });

  test('a wedge explodes along its own middle', () => {
    const [rightHalf] = pieShapes.wedges([{weight: 1}, {weight: 1}]);

    const {dx, dy} = pieShapes.explodedBy(rightHalf, 4);

    expect(dx).toBeCloseTo(4);
    expect(dy).toBeCloseTo(0);
  });

  test('the card cuts the session into a bought and a sold wedge, and says each share', async () => {
    const feed = await listeningFeed();
    render(<TestApp at="/" feed={feed}><Trading><Pie/></Trading></TestApp>);
    await feedIsSubscribed(feed);

    broadcast(feed, [tradeFrame(65001, now, '3', 'bought'), tradeFrame(65002, now, '1', 'sold')]);

    await waitFor(() => expect(chartsDesk.pieShares()).toEqual(['75% bought', '25% sold']));
  });

  test('the legend\'s shares add up to 100% when the sides split 1 to 7', async () => {
    const feed = await listeningFeed();
    render(<TestApp at="/" feed={feed}><Trading><Pie/></Trading></TestApp>);
    await feedIsSubscribed(feed);

    broadcast(feed, [tradeFrame(65001, now, '1', 'bought'), tradeFrame(65002, now, '7', 'sold')]);

    await waitFor(() => expect(chartsDesk.pieShares()).toEqual(['13% bought', '87% sold']));
  });

  test('the card says it counts up to the last 1,500 trades', async () => {
    const feed = await listeningFeed();
    render(<TestApp at="/" feed={feed}><Trading><Pie/></Trading></TestApp>);
    await feedIsSubscribed(feed);

    broadcast(feed, [tradeFrame(65001, now, '3', 'bought')]);

    await waitFor(() => expect(chartsDesk.chart('pie')).toHaveTextContent('volume by side · up to the last 1,500 trades'));
  });

  test('a one-sided session opens both gates fully', () => {
    expect(pieShapes.sweepGates(pieShapes.wedges([{weight: 2}, {weight: 0}])[0])).toEqual({opening: 0, closing: 180});
  });

  test('the card reads a one-sided session as all bought', async () => {
    const feed = await listeningFeed();
    render(<TestApp at="/" feed={feed}><Trading><Pie/></Trading></TestApp>);
    await feedIsSubscribed(feed);

    broadcast(feed, [tradeFrame(65001, now, '2', 'bought')]);

    const card = chartsDesk.chart('pie');
    await waitFor(() => expect(card).toHaveTextContent('100% bought'));
    expect(card).toHaveTextContent('0% sold');
  });

  test('an empty stream leaves the card waiting, not broken', async () => {
    const feed = await listeningFeed();
    render(<TestApp at="/" feed={feed}><Trading><Pie/></Trading></TestApp>);
    await feedIsSubscribed(feed);

    const card = chartsDesk.chart('pie');
    expect(card).not.toHaveTextContent('%');
    expect(card).toHaveTextContent('waiting for the first trade');
  });
});
