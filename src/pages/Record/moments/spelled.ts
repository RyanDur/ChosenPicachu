import {Maybe, nothing, some} from '@ryandur/sand';

const ones = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
  'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

const words = (count: number): string => count < 20
  ? ones[count]
  : [tens[Math.floor(count / 10)], count % 10 === 0 ? '' : `-${ones[count % 10]}`].join('');

const out = (count: number): Maybe<string> => count < 100 ? some(words(count)) : nothing();

export const spelled = {out};
