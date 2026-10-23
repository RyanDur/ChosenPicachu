import {vanillaFrame} from '../__test_support';

describe('the frame table, at lazy pace', () => {
  it('should keep the sort and add no report when a keyboard nudge meets the rail', async () => {
    vanillaFrame.stand({pace: 'lazy'});
    await vanillaFrame.choose('trades', 'ascending');
    expect(vanillaFrame.header('trades')).toHaveAttribute('aria-sort', 'ascending');

    await vanillaFrame.moveRowByKey(1, '{ArrowUp}');

    expect(vanillaFrame.header('trades')).toHaveAttribute('aria-sort', 'ascending');
    expect(vanillaFrame.windowNames()).toEqual(['this minute', 'last 5 minutes', 'last 15 minutes', 'this hour', 'session']);
    expect(vanillaFrame.moveReport()).toHaveTextContent('trades sorted ascending');
  });
});
