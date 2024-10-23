import {array} from '../array';
import {describe} from 'vitest';
import {faker} from '@faker-js/faker';

describe('array helpers', () => {
  const item = 'some item';

  describe('removeFrom', () => {
    test('when it receives an empty list', () => {
      expect(array.removeFrom('some item', [])).toEqual([]);
    });

    test('when the item is not in the list', () => {
      expect(array.removeFrom('some item', ['some other item'])).toEqual(['some other item']);
    });

    test('when the item is in the list', () => {
      expect(array.removeFrom('some item', ['some item'])).toEqual([]);
    });
  });

  describe('insertAt', () => {
    test('when it receives an empty list', () => {
      expect(array.insertAt(0, 'some item', [])).toEqual(['some item']);
    });

    test('when the adding to the end of the list', () => {
      expect(array.insertAt(1, 'some item', ['some other item']))
        .toEqual(['some other item', 'some item']);
    });

    test('when the adding to the start of the list', () => {
      expect(array.insertAt(0, 'some item', ['some other item']))
        .toEqual(['some item', 'some other item']);
    });

    test('when the index is past the end of the list', () => {
      expect(array.insertAt(2, 'some item', ['some other item']))
        .toEqual(['some other item', 'some item']);
    });

    test('when the index is past the start of the list', () => {
      expect(array.insertAt(-1, 'some item', ['some other item']))
        .toEqual(['some item', 'some other item']);
    });
  });

  describe('moveToIndex', () => {
    test('when it receives an empty list', () => {
      expect(array.moveToIndex(0, item, [])).toEqual([]);
    });

    test('when the item is not in the list', () => {
      expect(array.moveToIndex(0, 'nonexistent item', ['some other item', item]))
        .toEqual(['some other item', item]);
    });

    test('when the moving to the start of the list', () => {
      expect(array.moveToIndex(0, item, ['some other item', item]))
        .toEqual([item, 'some other item']);
    });

    test('when the moving past the start of the list', () => {
      expect(array.moveToIndex(-2, item, ['some other item', item]))
        .toEqual([item, 'some other item']);
    });

    test('when the moving to the end of the list', () => {
      expect(array.moveToIndex(1, item, [item, 'some other item']))
        .toEqual(['some other item', item]);
    });

    test('when the moving to past end of the list', () => {
      expect(array.moveToIndex(2, item, [item, 'some other item']))
        .toEqual(['some other item', item]);
    });

    test('moving to the middle of the list', () => {
      expect(array.moveToIndex(1, item, [item, 'some other item', 'yet more item']))
        .toEqual(['some other item', item, 'yet more item']);
    });
  });

  describe('moveToRowColumn', () => {
    test('when it receives an empty grid', () => {
      expect(array.moveToRowColumn(0, 0, item, [])).toEqual([[item]]);
    });

    test('when the item is not in the grid', () => {
      expect(array.moveToRowColumn(0, 0, 'some other item', [[item]]))
        .toEqual([['some other item', item]]);
    });

    test('when the moving to the start of the first row', () => {
      expect(array.moveToRowColumn(0, 0, item, [['some other item', item]]))
        .toEqual([[item, 'some other item']]);
    });
  });

  describe('removeFromGrid', () => {
    test('when it receives an empty grid', () => {
      expect(array.removeFromGrid(item, [])).toEqual([]);
    });

    test('when the item is not in the grid', () => {
      expect(array.removeFromGrid('nonexistent item', [[item]]))
        .toEqual([[item]]);
    });

    test('when the item is in the grid', () => {
      expect(array.removeFromGrid(item, [[item]])).toEqual([]);

      const text = faker.lorem.text();
      expect(array.removeFromGrid(item, [[text, item]])).toEqual([[text]]);

      expect(array.removeFromGrid(item, [[text], [item]])).toEqual([[text]]);

      const otherText = faker.lorem.text();
      expect(array.removeFromGrid(item, [[text], [otherText, item]])).toEqual([[text], [otherText]]);
    });
  });

  describe('addToGrid', () => {
    const text = faker.lorem.text();
    const otherText = faker.lorem.text();

    test('when it receives an empty grid', () => {
      expect(array.addToGrid(0, 0, item, [])).toEqual([[item]]);
    });

    test('when adding to the start of a row', () => {
      expect(array.addToGrid(0, 0, item, [[text]]))
        .toEqual([[item, text]]);

      expect(array.addToGrid(1, 0, item, [[text], [otherText]]))
        .toEqual([[text], [item, otherText]]);
    });

    test('when adding outside the available a column', () => {
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

    test('when adding to the end of a row', () => {
      expect(array.addToGrid(0, 1, item, [[text]]))
        .toEqual([[text, item]]);

      expect(array.addToGrid(1, 1, item, [[text], [otherText]]))
        .toEqual([[text], [otherText, item]]);

      expect(array.addToGrid(1, 1, item, [[text]]))
        .toEqual([[text], [item]]);

      expect(array.addToGrid(2, 1, item, [[text], [otherText]]))
        .toEqual([[text], [otherText], [item]]);

      expect(array.addToGrid(300, 1, item, [[text], [otherText]]))
        .toEqual([[text], [otherText], [item]]);

      expect(array.addToGrid(-1, 1, item, [[text]]))
        .toEqual([[text, item]]);

      expect(array.addToGrid(-2, 1, item, [[text], [otherText]]))
        .toEqual([[text, item], [otherText]]);
    });
  });
});