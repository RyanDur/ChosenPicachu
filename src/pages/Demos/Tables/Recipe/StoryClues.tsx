import {FC} from 'react';
import {Clues} from '../../Recipe/Arc';

const clues: [string, string][] = [
  ['keep themselves current', 'The data arrives over time. Nothing here is a page you load once.'],
  ['comparing side by side', 'Several measures over one shared set of periods. Two dimensions, not a list.'],
  ['what matters most on top', 'The order is the trader’s, not ours. Ranking is a feature, not a default.'],
  ['arranged the way I think', 'Both axes move. Columns and rows are things the hand can reach.'],
  ['it should just happen', 'No submit, no reload. The arrangement responds under the hand.']
];

export const StoryClues: FC = () =>
  <Clues quote="I watch the market all day. I need the numbers to keep themselves current, and I need them arranged the way I think: what I am comparing side by side, what matters most on top. When I sort something, it should just happen."
         by="a trader"
         clues={clues}
         verdict="Measures compared across a shared set of windows is tabular data, and a table is the element built for it: one dimension per axis, headers that name both, and a reading order assistive tech already understands. Everything after this point is layered onto that one choice."/>;
