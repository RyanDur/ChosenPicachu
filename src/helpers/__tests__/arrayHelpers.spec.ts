import {array} from '../array';
import {describe} from 'vitest';

describe('array helpers', () => {
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
    const item = 'some item';

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
});