import {add} from '../index';
import {nanoid} from 'nanoid';

describe('util', () => {
    describe('add', () => {
        it('should add the item to the specified index', () => {
            const item1 = nanoid();
            let actual = add(0, item1, []);
            expect(actual).toContain(item1);
            expect(actual.indexOf(item1)).toEqual(0);
            expect(actual.length).toEqual(1);

            const item2 = nanoid();
            actual = add(1, item2, actual);
            expect(actual).toContain(item2);
            expect(actual.indexOf(item2)).toEqual(1);
            expect(actual.length).toEqual(2);

            const item3 = nanoid();
            actual = add(0, item3, actual);
            expect(actual).toContain(item3);
            expect(actual.length).toEqual(3);
            expect(actual.indexOf(item3)).toEqual(0);

            const item4 = nanoid();
            actual = add(actual.length, item4, actual);
            expect(actual).toContain(item4);
            expect(actual.length).toEqual(4);
            expect(actual.indexOf(item4)).toEqual(3);

            const item5 = nanoid();
            actual = add(actual.length + 5, item5, actual);
            expect(actual).toContain(item5);
            expect(actual.length).toEqual(5);
            expect(actual.indexOf(item1)).toEqual(1);
            expect(actual.indexOf(item2)).toEqual(2);
            expect(actual.indexOf(item3)).toEqual(0);
            expect(actual.indexOf(item4)).toEqual(3);
            expect(actual.indexOf(item5)).toEqual(4);
        });
    });
});