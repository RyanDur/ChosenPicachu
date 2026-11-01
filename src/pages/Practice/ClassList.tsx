import {FC} from 'react';
import './ClassList.css';

type Band = {
  readonly classes: string;
  readonly word: string;
  readonly look: string;
};

type Placed = Band & {
  readonly x: number;
  readonly y: number;
};

const advance = 4.8;
const title = 'A class list read left to right';
const opening = '<th scope="col" class="';
const closing = '">Price</th>';

const nouns: Band = {classes: 'cell header-cell', word: 'nouns', look: 'faded-mint-filled'};
const needs: Band = {classes: 'muted-rule-after muted-bar-below focus-ringed', word: 'needs', look: 'paper-filled'};
const states: Band = {classes: 'carried', word: 'states', look: 'faded-leather-filled'};

const widthOf = (text: string): number => text.length * advance;

const Run: FC<{band: Placed; braceAt: number; wordAt: number}> = ({
  band: {classes, word, look, x, y},
  braceAt,
  wordAt
}) => <>
  <rect className={`${look} drawn`} x={x - 2} y={y - 8.5} width={widthOf(classes) + 4} height={12}/>
  <text className="drawn-to-scale monospaced" x={x} y={y}>{classes}</text>
  <path className="hollow drawn" d={`M${x} ${braceAt} v4 h${widthOf(classes)} v-4`}/>
  <text className="drawn-to-scale" x={x + widthOf(classes) / 2} y={wordAt} textAnchor="middle">{word}</text>
</>;

const Code: FC<{x: number; y: number; children: string}> = ({x, y, children}) =>
  <text className="drawn-to-scale monospaced" x={x} y={y}>{children}</text>;

const wideRuns: Placed[] = [
  {...nouns, x: 116.4, y: 14},
  {...needs, x: 198.2, y: 14},
  {...states, x: 424, y: 14}
];

const WideClassList: FC = () =>
  <svg className="class-list-wide ink-filled" viewBox="0 0 520 44" role="img" aria-labelledby="class-list-wide-title">
    <title id="class-list-wide-title">{title}</title>
    <Code x={2} y={14}>{opening}</Code>
    {wideRuns.map(band => <Run key={band.word} band={band} braceAt={22} wordAt={36}/>)}
    <Code x={461.6} y={14}>{closing}</Code>
  </svg>;

const narrowRuns: Placed[] = [
  {...nouns, x: 10, y: 36},
  {...needs, x: 92.8, y: 36},
  {...states, x: 10, y: 80}
];

const NarrowClassList: FC = () =>
  <svg className="class-list-narrow center ink-filled" viewBox="0 0 320 112" role="img"
    aria-labelledby="class-list-narrow-title">
    <title id="class-list-narrow-title">{title}</title>
    <Code x={6} y={16}>{opening}</Code>
    {narrowRuns.map(band => <Run key={band.word} band={band} braceAt={band.y + 8} wordAt={band.y + 22}/>)}
    <Code x={49.6} y={80}>{closing}</Code>
  </svg>;

export const ColumnHeaderClassList: FC = () =>
  <figure className="class-list">
    <WideClassList/>
    <NarrowClassList/>
    <figcaption className="caption">The table’s column header, with its class attribute read left to right: nouns, then
      needs, then states.
    </figcaption>
  </figure>;
