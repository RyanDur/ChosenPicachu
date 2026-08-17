import {FC, PropsWithChildren, ReactNode, useId, useState} from 'react';
import {has} from '@ryandur/sand';

export type Word =
  | 'aloft' | 'survey' | 'drift' | 'flight' | 'ghost'
  | 'strike' | 'settle' | 'landing' | 'seats' | 'share' | 'travel' | 'reconcile'
  | 'rule' | 'standing' | 'drape' | 'bake';

const sand =
  <a className="signpost"
     href="https://ryandur.github.io/sand/"
     target="_blank"
     rel="noreferrer">sand</a>;

const definitions: Record<Word, ReactNode> = {
  aloft: <>whatever the hand is carrying, named by its key or its seat; in React it rides
    a Maybe from {sand}: nothing until a lift</>,
  survey: 'the one measurement taken at the grab: the table’s box, every column’s width, later the row heights',
  drift: 'how far the pointer has moved since the grab',
  flight: 'the box the carried thing was grabbed in: where the ghost starts',
  ghost: 'the copy of the carried column or row that rides the pointer',
  strike: 'the moment the pointer crosses far enough into a neighbour to count',
  settle: 'the reorder a strike causes',
  landing: 'the destination a lazy drag remembers instead of settling',
  seats: 'the rows’ order: a row keeps its number while its seat changes',
  share: 'a column’s slice of the table’s width: a fraction, not a pixel',
  travel: 'everything between the lift and the drop: the shared move handling',
  reconcile: 'walking the DOM to match the state, moving only what changed',
  rule: 'the chosen column and direction: what the table ranks by',
  standing: 'the seats with the rule draped over them: the order actually on screen',
  drape: 'ranking through the rule at render time, leaving the seats unwritten',
  bake: 'writing the current standing into the seats and clearing the rule'
};

const definitionOf = (id: string): HTMLElement | undefined => {
  const element = document.getElementById(id);
  return element instanceof HTMLElement ? element : undefined;
};

const revealed = (id: string): void => {
  const definition = definitionOf(id);
  if (has(definition) && typeof definition.showPopover === 'function' && !definition.matches(':popover-open')) {
    definition.showPopover();
  }
};

const concealed = (id: string): void => {
  const definition = definitionOf(id);
  if (has(definition) && typeof definition.hidePopover === 'function' && definition.matches(':popover-open')) {
    definition.hidePopover();
  }
};

export const Term: FC<PropsWithChildren<{word: Word}>> = ({word, children}) => {
  const anchor = `--term-${useId().replace(/[^a-zA-Z0-9-]/g, '')}`;
  const id = `definition${anchor}`;
  const [intent, setIntent] = useState<number>();
  return <>
    <button type="button"
            className="term"
            popoverTarget={id}
            style={{'--term-anchor': anchor}}
            onMouseEnter={() => setIntent(window.setTimeout(() => revealed(id), 120))}
            onMouseLeave={() => {
              window.clearTimeout(intent);
              concealed(id);
            }}
            onFocus={() => revealed(id)}
            onBlur={() => concealed(id)}>{children ?? word}</button>
    <span id={id}
          popover="auto"
          className="term-definition paper rounded-corners drop-shadow"
          style={{'--term-anchor': anchor}}>{definitions[word]}</span>
  </>;
};
