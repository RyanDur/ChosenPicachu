import {Column, Row} from '@components/Table';

const lorem = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'eiusmod', 'tempor', 'incididunt', 'labore', 'dolore', 'magna', 'aliqua',
  'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip'
];

const randomNumberFromRange = (min: number, max = 6) => Math.floor(Math.random() * max) + min;
const word = () => lorem[Math.floor(Math.random() * lorem.length)];
export const words = (num = 6) => Array.from({length: randomNumberFromRange(1, num)}, word).join(' ');

const wordsDistinctFrom = (taken: string[]): string => {
  const candidate = words();
  return taken.includes(candidate) ? wordsDistinctFrom(taken) : candidate;
};

export const column1Name = wordsDistinctFrom([]);
export const column2Name = wordsDistinctFrom([column1Name]);
export const column3Name = wordsDistinctFrom([column1Name, column2Name]);

export const column1Display = words();
export const column3Display = words();

export const row1Col0Value = words();

export const row0Col0Display = words();
export const row0Col1Display = words();

export const row0Col2Display = words();

export const row1Col1Display = words();
export const row1Col2Display = words();

export const row2Col0Display = words();
export const row2Col1Display = words();
export const row2Col2Display = words();

export const columns: Column[] = [
  {
    column: column1Name,
    display: <h2 data-testid="column1">{column1Display}</h2>,
    className: 'aClassName'
  },
  {display: column2Name, column: column2Name},
  {column: column3Name, display: column3Display}
];

export const rows: Row[] = [{
  [column1Name]: {
    display: <h3>{row0Col0Display}</h3>
  },
  [column2Name]: {
    display: <h3>{row0Col1Display}</h3>
  },
  [column3Name]: {
    display: row0Col2Display,
    className: 'aSingleClassName'
  }
}, {
  [column1Name]: {
    display: row1Col0Value
  },
  [column2Name]: {
    display: <h3>{row1Col1Display}</h3>
  },
  [column3Name]: {
    display: <h3>{row1Col2Display}</h3>
  }
}, {
  [column1Name]: {
    display: row2Col0Display
  },
  [column2Name]: {
    display: <h3>{row2Col1Display}</h3>
  },
  [column3Name]: {
    display: <h3>{row2Col2Display}</h3>
  }
}, {
  [column1Name]: {
    display: word()
  },
  [column2Name]: {
    display: <h3>{word()}</h3>
  },
  [column3Name]: {
    display: <h3>{word()}</h3>
  }
}, {
  [column1Name]: {
    display: word()
  },
  [column2Name]: {
    display: <h3>{word()}</h3>
  },
  [column3Name]: {
    display: <h3>{word()}</h3>
  }
}, {
  [column1Name]: {
    display: word()
  },
  [column2Name]: {
    display: <h3>{word()}</h3>
  },
  [column3Name]: {
    display: <h3>{word()}</h3>
  }
}, {
  [column1Name]: {
    display: word()
  },
  [column2Name]: {
    display: <h3>{word()}</h3>
  },
  [column3Name]: {
    display: <h3>{word()}</h3>
  }
}];
