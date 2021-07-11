import {age, AgeIn} from '../util';

describe('util', () => {
    describe('age', () => {
        it('should return how old something is', () => {
            Date.now = () => new Date('2021-07-11').getTime();
            const dob = new Date('1978-11-28');
            expect(age(dob)).toEqual({age: 42, in: AgeIn.YEARS});
            const dob2 = new Date('1979-11-28');
            expect(age(dob2)).toEqual({age: 41, in: AgeIn.YEARS});

            const dob3 = new Date('2021-06-09');
            expect(age(dob3)).toEqual({age: 1, in: AgeIn.MONTHS});
            const dob4 = new Date('2021-01-09');
            expect(age(dob4)).toEqual({age: 6, in: AgeIn.MONTHS});

            const dob5 = new Date('2021-07-05');
            expect(age(dob5)).toEqual({age: 6, in: AgeIn.DAYS});
            const dob6 = new Date('2021-07-01');
            expect(age(dob6)).toEqual({age: 10, in: AgeIn.DAYS});
        });
    });
});