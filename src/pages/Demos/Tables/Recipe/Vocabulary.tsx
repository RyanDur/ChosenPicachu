import {FC} from 'react';

const words: [string, string][] = [
  ['aloft', 'whatever the hand is carrying, named by its key or its seat'],
  ['survey', 'the one measurement taken at the grab: the table’s box, every column’s width, later the row heights'],
  ['drift', 'how far the pointer has moved since the grab'],
  ['flight', 'the box the carried thing was grabbed in: where the ghost starts'],
  ['ghost', 'the copy of the carried column or row that rides the pointer'],
  ['strike', 'the moment the pointer crosses far enough into a neighbour to count'],
  ['settle', 'the reorder a strike causes'],
  ['landing', 'the destination a lazy drag remembers instead of settling'],
  ['seats', 'the rows’ order: a row keeps its number while its seat changes'],
  ['share', 'a column’s slice of the table’s width: a fraction, not a pixel']
];

export const Vocabulary: FC = () =>
  <aside className="vocabulary" aria-label="the words this page coins">
    <h3 className="vocabulary-title">the words this page coins</h3>
    <dl className="vocabulary-words">
      {words.map(([word, meaning]) =>
        <div className="vocabulary-entry" key={word}>
          <dt className="vocabulary-word">{word}</dt>
          <dd className="vocabulary-meaning">{meaning}</dd>
        </div>)}
    </dl>
    <p className="vocabulary-note paragraph">And has is the null check from a small library
      called <a className="signpost"
        href="https://ryandur.github.io/sand/"
        target="_blank"
        rel="noreferrer">sand</a>; it answers false for nothing and for empty. In the React
      world, aloft rides sand’s Maybe: nothing until a lift, and map runs only while something
      is held.</p>
  </aside>;
