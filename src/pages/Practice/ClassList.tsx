import {FC} from 'react';
import './ClassList.css';

type Run = {
  readonly classes: string;
  readonly word: string;
  readonly look: string;
};

type Segment = string | Run;

type Placed = {
  readonly segment: Segment;
  readonly x: number;
};

// drawn-to-scale sets the code at var(--base), 8 units of the drawing, and a monospace face advances 0.6em a character.
const codeSize = 8;
const advance = codeSize * 0.6;
const gap = 5;
const margin = 4;

const title = 'A class list read left to right';
const opening = '<th scope="col" class="';
const closing = '">trades</th>';

const nouns: Run = {classes: 'cell header-cell', word: 'nouns', look: 'faded-mint-filled'};
const needs: Run = {classes: 'muted-rule-after muted-bar-below focus-ringed', word: 'needs', look: 'paper-filled'};
const states: Run = {classes: 'carried', word: 'states', look: 'faded-leather-filled'};

const tag = `${opening}${[nouns, needs, states].map(run => run.classes).join(' ')}${closing}`;

const textOf = (segment: Segment): string => typeof segment === 'string' ? segment : segment.classes;
const widthOf = (text: string): number => text.length * advance;
const lengthOf = (segments: Segment[]): number =>
  segments.reduce((length, segment) => length + widthOf(textOf(segment)) + gap, -gap);

const placedAlong = (segments: Segment[]): Placed[] =>
  segments.map((segment, at) => ({segment, x: margin + lengthOf(segments.slice(0, at)) + (at > 0 ? gap : 0)}));

const Code: FC<{x: number; y: number; children: string}> = ({x, y, children}) =>
  <text className="drawn-to-scale monospaced" x={x} y={y}>{children}</text>;

const DrawnRun: FC<{run: Run; x: number; y: number}> = ({run: {classes, word, look}, x, y}) => <>
  <rect className={`${look} drawn`} x={x - 2} y={y - 8.5} width={widthOf(classes) + 4} height={12}/>
  <Code x={x} y={y}>{classes}</Code>
  <path className="hollow drawn" d={`M${x} ${y + 8} v4 h${widthOf(classes)} v-4`}/>
  <text className="drawn-to-scale" x={x + widthOf(classes) / 2} y={y + 22} textAnchor="middle">{word}</text>
</>;

const Line: FC<{segments: Segment[]; y: number}> = ({segments, y}) => <>
  {placedAlong(segments).map(({segment, x}) => typeof segment === 'string'
    ? <Code key={segment} x={x} y={y}>{segment}</Code>
    : <DrawnRun key={segment.word} run={segment} x={x} y={y}/>)}
</>;

const oneLine: Segment[] = [opening, nouns, needs, states, closing];
const wideWidth = margin * 2 + lengthOf(oneLine);

const WideClassList: FC = () =>
  <svg className="class-list-wide ink-filled" viewBox={`0 0 ${wideWidth} 44`} role="img"
    aria-labelledby="class-list-wide-title">
    <title id="class-list-wide-title">{title}</title>
    <Line segments={oneLine} y={14}/>
  </svg>;

const NarrowClassList: FC = () =>
  <svg className="class-list-narrow center ink-filled" viewBox="0 0 320 112" aria-hidden="true">
    <Line segments={[opening]} y={16}/>
    <Line segments={[nouns, needs]} y={36}/>
    <Line segments={[states, closing]} y={80}/>
  </svg>;

export const ColumnHeaderClassList: FC = () =>
  <figure className="class-list">
    <code className="off-screen monospaced">{tag}</code>
    <WideClassList/>
    <NarrowClassList/>
    <figcaption className="caption">The table’s trades header, its class list trimmed to a few of each kind, read left
      to right: nouns, then needs, then states.
    </figcaption>
  </figure>;
