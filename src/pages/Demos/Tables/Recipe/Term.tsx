import {FC, PropsWithChildren, useId} from 'react';
import {has} from '@ryandur/sand';

export type Word =
  | 'aloft' | 'survey' | 'drift' | 'flight' | 'ghost'
  | 'strike' | 'settle' | 'landing' | 'seats' | 'share';

const definitions: Record<Word, string> = {
  aloft: 'whatever the hand is carrying, named by its key or its seat',
  survey: 'the one measurement taken at the grab: the table’s box, every column’s width, later the row heights',
  drift: 'how far the pointer has moved since the grab',
  flight: 'the box the carried thing was grabbed in: where the ghost starts',
  ghost: 'the copy of the carried column or row that rides the pointer',
  strike: 'the moment the pointer crosses far enough into a neighbour to count',
  settle: 'the reorder a strike causes',
  landing: 'the destination a lazy drag remembers instead of settling',
  seats: 'the rows’ order: a row keeps its number while its seat changes',
  share: 'a column’s slice of the table’s width: a fraction, not a pixel'
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
  return <>
    <button type="button"
            className="term"
            popoverTarget={id}
            style={{'--term-anchor': anchor}}
            onMouseEnter={() => revealed(id)}
            onMouseLeave={() => concealed(id)}
            onFocus={() => revealed(id)}
            onBlur={() => concealed(id)}>{children ?? word}</button>
    <span id={id}
          popover="auto"
          className="term-definition paper rounded-corners drop-shadow"
          style={{'--term-anchor': anchor}}>{definitions[word]}</span>
  </>;
};
