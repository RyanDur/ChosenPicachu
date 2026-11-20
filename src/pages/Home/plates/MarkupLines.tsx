import {FC} from 'react';
import {Ink, markup} from './markup';
import {thePage} from './thePage';

const inkClasses: Record<Ink, string> = {
  bracket: 'markup-bracket-filled',
  tag: 'markup-tag-filled',
  attribute: 'markup-attribute-filled',
  words: 'ink-filled'
};

export const MarkupLines: FC = () =>
  <g className="monospaced" fontSize={thePage.letterSize}>
    {thePage.markupLines.map((line, row) =>
      <text key={row} x={thePage.startOf(line)} y={thePage.baselineOf(row)} textLength={thePage.lengthOf(line)}
        lengthAdjust="spacingAndGlyphs">
        {markup.tokensOf(line).map(({ink, text}, at) => <tspan key={at} className={inkClasses[ink]}>{text}</tspan>)}
      </text>)}
  </g>;
