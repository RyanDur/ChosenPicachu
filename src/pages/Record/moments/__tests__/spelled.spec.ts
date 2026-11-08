import {spelled} from '../spelled';

test('a count under a hundred is spelled out in words', () => {
  expect(spelled.out(24).orElse('')).toBe('twenty-four');
});

test('a count of a hundred or more has no words', () => {
  expect(spelled.out(100).isNothing).toBe(true);
});
