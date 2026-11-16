import {describe, expect, it} from 'vitest';
import {nothing} from '@ryandur/sand';
import {survey} from '../survey';
import {travel} from '../travel';

describe('a lazy drag', () => {
  const order = ['lookback', 'trades', 'buys', 'change'];
  const columnWidths = {lookback: 100, trades: 100, buys: 100, change: 100};
  const landingAfter = travel.lazy(survey.columnUnder(order, {left: 0, top: 0, width: 400, height: 100, columnWidths}));

  it('keeps the landing it last found when the pointer leaves every seat', () => {
    const overBuys = landingAfter('trades', {clientX: 260, clientY: 50}, nothing());
    const offTheTable = landingAfter('trades', {clientX: 260, clientY: 300}, overBuys);

    expect(offTheTable.orNull()).toBe('buys');
  });
});
