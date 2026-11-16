import {timelineEntries} from '@pages/Record/timelineEntries';

describe('the timeline', () => {
  it('should show a month moment alone in its year as a moment, not a fold', () => {
    const lone = {date: {kind: 'month', year: '2019', month: 3}};

    expect(timelineEntries.of(['lone'], {lone}, {})).toEqual([{kind: 'moment', key: 'lone'}]);
  });
});
