import {cells, Measure, Measures} from '@pages/Demos/Market/cells';

const counted = (value: number): Measure => ({display: `${value}`, value});

const thisMinute = (overrides: Partial<Measures>): Measures => ({
  lookback: {display: 'this minute', key: 'minute'},
  trades: counted(1),
  buys: counted(1),
  sells: counted(0),
  volume: counted(1),
  vwap: counted(65000),
  change: counted(0),
  ...overrides
});

describe('a row of totals marked against the row before the newest trade', () => {
  test('should mark a number that rose as up', () => {
    const now = cells.markedAgainst(thisMinute({trades: counted(1)}), thisMinute({trades: counted(2)}));

    expect(now.trades.moved).toBe('up');
  });

  test('should mark a number that fell as down', () => {
    const now = cells.markedAgainst(thisMinute({vwap: counted(65005)}), thisMinute({vwap: counted(65001)}));

    expect(now.vwap.moved).toBe('down');
  });

  test('should leave unmarked a number the trade did not change', () => {
    const now = cells.markedAgainst(thisMinute({sells: counted(1)}), thisMinute({sells: counted(1)}));

    expect(now.sells.moved).toBeUndefined();
  });

  test('should leave unmarked a number whose value held though its words changed', () => {
    const now = cells.markedAgainst(
      thisMinute({change: {display: '-$0.00', value: 0}}),
      thisMinute({change: {display: '+$0.00', value: 0}}));

    expect(now.change.moved).toBeUndefined();
  });

  test('should leave unmarked a number that had none before the trade', () => {
    const now = cells.markedAgainst(thisMinute({change: {display: '—'}}), thisMinute({change: counted(3)}));

    expect(now.change.moved).toBeUndefined();
  });
});
