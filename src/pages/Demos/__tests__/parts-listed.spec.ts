import {PartsEntry, partsListed} from '@pages/Demos/parts-listed';

const anEntry = (to: string): PartsEntry => ({to, name: to, minutes: 2, says: ''});

const entries = (count: number): readonly PartsEntry[] =>
  Array.from({length: count}, (_, at) => anEntry(`part-${at}`));

describe('the count line over a tab’s parts', () => {
  test('should count a tab of one part as one part', () => {
    expect(partsListed.counted([{entries: entries(1)}])).toBe('One part, about 2 minutes.');
  });

  test('should count every part across the groups', () => {
    expect(partsListed.counted([{entries: entries(2)}, {label: 'tutorials', entries: entries(3)}]))
      .toBe('Five parts, about 10 minutes.');
  });

  test('should count past twelve parts in figures', () => {
    expect(partsListed.counted([{entries: entries(13)}])).toBe('13 parts, about 26 minutes.');
  });
});
