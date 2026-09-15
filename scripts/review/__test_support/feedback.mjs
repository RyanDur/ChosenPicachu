export const aDelta = (traits = {}) => ({
  door: 'structure',
  severity: 'note',
  file: 'src/somewhere.tsx',
  line: 1,
  happened: 'something in the code bends a door',
  why: 'it costs the reader',
  change: 'change it',
  principle: 'the door says so',
  ...traits
});

export const aPlus = (traits = {}) => ({
  door: 'structure',
  file: 'src/somewhere.tsx',
  line: 1,
  happened: 'something in the code holds a door up',
  why: 'it works for the reader',
  principle: 'the door says so',
  ...traits
});

export const review = (plusses, deltas) => ({plusses, deltas});
