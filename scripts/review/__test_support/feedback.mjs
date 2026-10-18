import {has} from '@ryandur/sand';

export const aHabit = (traits = {}) => ({
  title: 'a section is named by its heading',
  rule: 'The structure rubric: sections name themselves through their headings.',
  problem: 'A reader who walks the page by headings never finds the section.',
  why: 'The section is skipped by anyone who does not read from the top.',
  fix: 'Give each section a heading that names it.',
  ...traits
});

export const aDelta = (traits = {}) => ({
  rubric: 'structure',
  habit: aHabit().title,
  severity: 'note',
  file: 'src/somewhere.tsx',
  line: 1,
  happened: 'something in the code bends a rubric',
  why: 'it costs the reader',
  evidence: 'read',
  change: 'change it',
  principle: 'the rubric says so',
  ...traits
});

export const aPlus = (traits = {}) => ({
  rubric: 'structure',
  habit: aHabit().title,
  file: 'src/somewhere.tsx',
  line: 1,
  happened: 'something in the code holds a rubric up',
  why: 'it works for the reader',
  evidence: 'read',
  principle: 'the rubric says so',
  ...traits
});

export const review = (plusses, deltas, habits = [aHabit()], deferred) =>
  ({overview: 'The push names its sections.', nextSteps: [], habits, plusses, deltas, ...(has(deferred) ? {deferred} : {})});
