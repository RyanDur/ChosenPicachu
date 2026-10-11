const ones = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
  'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

export const spelledOut = (count: number): string => count < 20
  ? ones[count]
  : [tens[Math.floor(count / 10)], count % 10 === 0 ? '' : `-${ones[count % 10]}`].join('');
