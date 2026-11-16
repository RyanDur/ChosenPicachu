import {entriesOf} from '@pages/Record/timelineEntries';

describe('the timeline', () => {
  it('should show a month moment alone in its year as a moment, not a fold', () => {
    const lone = {date: {kind: 'month', year: '2019', month: 3}};

    expect(entriesOf(['lone'], {lone}, {})).toEqual([{kind: 'moment', key: 'lone'}]);
  });
});
