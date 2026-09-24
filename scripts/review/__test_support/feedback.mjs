import {has} from '@ryandur/sand';

export const aHabit = (traits = {}) => ({
  title: 'a section is named by its heading',
  rule: 'The structure door: sections name themselves through their headings.',
  fix: 'Give each section a heading that names it.',
  ...traits
});

export const aDelta = (traits = {}) => ({
  door: 'structure',
  habit: 'a section is named by its heading',
  severity: 'note',
  file: 'src/somewhere.tsx',
  line: 1,
  happened: 'something in the code bends a door',
  why: 'it costs the reader',
  evidence: 'read',
  change: 'change it',
  principle: 'the door says so',
  ...traits
});

export const aPlus = (traits = {}) => ({
  door: 'structure',
  habit: 'a section is named by its heading',
  file: 'src/somewhere.tsx',
  line: 1,
  happened: 'something in the code holds a door up',
  why: 'it works for the reader',
  evidence: 'read',
  principle: 'the door says so',
  ...traits
});

export const review = (plusses, deltas, habits = [aHabit()], deferred) =>
  ({habits, plusses, deltas, ...(has(deferred) ? {deferred} : {})});
