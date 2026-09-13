import {array} from '@components/arrays';
import {describe} from 'vitest';
import {faker} from '@faker-js/faker';

describe('array helpers', () => {
  const item = 'some item';

  describe('removeFrom', () => {
    test('an empty list stays empty', () => {
      expect(array.removeFrom([], 'some item')).toEqual([]);
    });

    test('a list without the item is left as it was', () => {
      expect(array.removeFrom(['some other item'], 'some item')).toEqual(['some other item']);
    });

    test('the item is taken out of the list', () => {
      expect(array.removeFrom(['some item'], 'some item')).toEqual([]);
    });
  });

  describe('insertAt', () => {
    test('an empty list gains the item', () => {
      expect(array.insertAt(0, 'some item', [])).toEqual(['some item']);
    });

    test('the item lands at the end of the list', () => {
      expect(array.insertAt(1, 'some item', ['some other item']))
        .toEqual(['some other item', 'some item']);
    });

    test('the item lands at the start of the list', () => {
      expect(array.insertAt(0, 'some item', ['some other item']))
        .toEqual(['some item', 'some other item']);
    });

    test('an index past the end lands the item last', () => {
      expect(array.insertAt(2, 'some item', ['some other item']))
        .toEqual(['some other item', 'some item']);
    });

    test('an index before the start lands the item first', () => {
      expect(array.insertAt(-1, 'some item', ['some other item']))
        .toEqual(['some item', 'some other item']);
    });
  });

  describe('moveToIndex', () => {
    test('an empty list stays empty', () => {
      expect(array.moveToIndex(0, item, [])).toEqual([]);
    });

    test('a list without the item is left as it was', () => {
      expect(array.moveToIndex(0, 'nonexistent item', ['some other item', item]))
        .toEqual(['some other item', item]);
    });

    test('the item moves to the start of the list', () => {
      expect(array.moveToIndex(0, item, ['some other item', item]))
        .toEqual([item, 'some other item']);
    });

    test('an index before the start moves the item first', () => {
      expect(array.moveToIndex(-2, item, ['some other item', item]))
        .toEqual([item, 'some other item']);
    });

    test('the item moves to the end of the list', () => {
      expect(array.moveToIndex(1, item, [item, 'some other item']))
        .toEqual(['some other item', item]);
    });

    test('an index past the end moves the item last', () => {
      expect(array.moveToIndex(2, item, [item, 'some other item']))
        .toEqual(['some other item', item]);
    });

    test('the item moves to the middle of the list', () => {
      expect(array.moveToIndex(1, item, [item, 'some other item', 'yet more item']))
        .toEqual(['some other item', item, 'yet more item']);
    });
  });

  describe('moveToRowColumn', () => {
    test('an empty grid gains a row holding the item', () => {
      expect(array.moveToRowColumn(0, 0, item, [])).toEqual([[item]]);
    });

    test('an item not yet in the grid is placed where asked', () => {
      expect(array.moveToRowColumn(0, 0, 'some other item', [[item]]))
        .toEqual([['some other item', item]]);
    });

    test('the item moves to the start of the first row', () => {
      expect(array.moveToRowColumn(0, 0, item, [['some other item', item]]))
        .toEqual([[item, 'some other item']]);
    });
  });

  describe('removeFromGrid', () => {
    test('an empty grid stays empty', () => {
      expect(array.removeFromGrid(item, [])).toEqual([]);
    });

    test('a grid without the item is left as it was', () => {
      expect(array.removeFromGrid('nonexistent item', [[item]]))
        .toEqual([[item]]);
    });

    test('the item is taken out of its row', () => {
      const text = faker.lorem.text();
      expect(array.removeFromGrid(item, [[text, item]])).toEqual([[text]]);

      const otherText = faker.lorem.text();
      expect(array.removeFromGrid(item, [[text], [otherText, item]])).toEqual([[text], [otherText]]);
    });

    test('a row emptied by the removal is dropped', () => {
      expect(array.removeFromGrid(item, [[item]])).toEqual([]);

      const text = faker.lorem.text();
      expect(array.removeFromGrid(item, [[text], [item]])).toEqual([[text]]);
    });
  });

  describe('addToGrid', () => {
    const text = faker.lorem.text();
    const otherText = faker.lorem.text();

    test('an empty grid gains a row holding the item', () => {
      expect(array.addToGrid(0, 0, item, [])).toEqual([[item]]);
    });

    test('the item lands at the start of its row', () => {
      expect(array.addToGrid(0, 0, item, [[text]]))
        .toEqual([[item, text]]);

      expect(array.addToGrid(1, 0, item, [[text], [otherText]]))
        .toEqual([[text], [item, otherText]]);
    });

    test('a column outside the row is clamped to its nearest end', () => {
      expect(array.addToGrid(0, 0, item, [[text]]))
        .toEqual([[item, text]]);

      expect(array.addToGrid(0, 1, item, [[text], [otherText]]))
        .toEqual([[text, item], [otherText]]);

      expect(array.addToGrid(0, 100, item, [[text], [otherText]]))
        .toEqual([[text, item], [otherText]]);

      expect(array.addToGrid(0, -1, item, [[text], [otherText]]))
        .toEqual([[item, text], [otherText]]);

      expect(array.addToGrid(0, -100, item, [[text], [otherText]]))
        .toEqual([[item, text], [otherText]]);

      expect(array.addToGrid(1, -1, item, [[text], [otherText]]))
        .toEqual([[text], [item, otherText]]);

      expect(array.addToGrid(1, -100, item, [[text], [otherText]]))
        .toEqual([[text], [item, otherText]]);
    });

    test('the item lands at the end of its row', () => {
      expect(array.addToGrid(0, 1, item, [[text]]))
        .toEqual([[text, item]]);

      expect(array.addToGrid(1, 1, item, [[text], [otherText]]))
        .toEqual([[text], [otherText, item]]);
    });

    test('a row past the last is added', () => {
      expect(array.addToGrid(1, 1, item, [[text]]))
        .toEqual([[text], [item]]);

      expect(array.addToGrid(2, 1, item, [[text], [otherText]]))
        .toEqual([[text], [otherText], [item]]);

      expect(array.addToGrid(300, 1, item, [[text], [otherText]]))
        .toEqual([[text], [otherText], [item]]);
    });

    test('a row before the first is clamped to the first', () => {
      expect(array.addToGrid(-1, 1, item, [[text]]))
        .toEqual([[text, item]]);

      expect(array.addToGrid(-2, 1, item, [[text], [otherText]]))
        .toEqual([[text, item], [otherText]]);
    });
  });
});