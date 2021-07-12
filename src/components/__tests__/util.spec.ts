import {age, AgeIn} from '../util';

describe('util', () => {
    describe('age', () => {
        it('should return how old something is', () => {
            Date.now = () => new Date('2021-07-11').getTime();
            const dob = new Date('1978-11-28');
            expect(age(dob)).toEqual({value: 42, unit: AgeIn.YEARS});
            const dob2 = new Date('1979-11-28');
            expect(age(dob2)).toEqual({value: 41, unit: AgeIn.YEARS});

            const dob3 = new Date('2021-06-09');
            expect(age(dob3)).toEqual({value: 1, unit: AgeIn.MONTHS});
            const dob4 = new Date('2021-01-09');
            expect(age(dob4)).toEqual({value: 6, unit: AgeIn.MONTHS});

            const dob5 = new Date('2021-07-05');
            expect(age(dob5)).toEqual({value: 6, unit: AgeIn.DAYS});
            const dob6 = new Date('2021-07-01');
            expect(age(dob6)).toEqual({value: 10, unit: AgeIn.DAYS});
        });
    });
});