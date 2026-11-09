import {Period} from '../../Market';
import {chartCaption} from '../chart-caption';

describe('the chart caption', () => {
  it('a period nothing has asked for is captioned as loading history', () => {
    expect(chartCaption.of({state: 'unasked'}, 0, Period.hour)).toBe('loading history');
  });
});
