import {FC} from 'react';
import './PracticeDrawing.css';
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

// A monospace face advances 0.6em a character, so a run's width follows from the one size its text is set at.
const codeSize = 8;
const advance = codeSize * 0.6;
const gap = 5;
const margin = 4;

const opening = '<th scope="col" class="';
const closing = '">trades</th>';

const nouns: Run = {classes: 'cell header-cell', word: 'nouns', look: 'faded-mint-filled'};
const needs: Run = {classes: 'muted-rule-after muted-bar-below focus-ringed', word: 'needs', look: 'paper-filled'};
const states: Run = {classes: 'carried', word: 'states', look: 'faded-leather-filled'};

const tag = `${opening}${[nouns, needs, states].map(run => run.classes).join(' ')}${closing}`;

const textOf = (segment: Segment): string => typeof segment === 'string' ? segment : segment.classes;
const widthOf = (text: string): number => text.length * advance;
const lengthOf = (segments: Segment[]): number =>
  segments.reduce((length, segment, at) => length + (at > 0 ? gap : 0) + widthOf(textOf(segment)), 0);

const placedAlong = (segments: Segment[]): Placed[] =>
  segments.map((segment, at) => ({segment, x: margin + (at > 0 ? lengthOf(segments.slice(0, at)) + gap : 0)}));

const Code: FC<{x: number; y: number; children: string}> = ({x, y, children}) =>
  <text className="monospaced" x={x} y={y} fontSize={codeSize}>{children}</text>;

const DrawnRun: FC<{run: Run; x: number; y: number}> = ({run: {classes, word, look}, x, y}) => <>
  <rect className={`${look} drawn`} x={x - 2} y={y - 8.5} width={widthOf(classes) + 4} height={12}/>
  <Code x={x} y={y}>{classes}</Code>
  <path className="hollow drawn" d={`M${x} ${y + 8} v4 h${widthOf(classes)} v-4`}/>
  <text x={x + widthOf(classes) / 2} y={y + 22} fontSize={codeSize} textAnchor="middle">{word}</text>
</>;

const Line: FC<{segments: Segment[]; y: number}> = ({segments, y}) => <>
  {placedAlong(segments).map(({segment, x}) => typeof segment === 'string'
    ? <Code key={segment} x={x} y={y}>{segment}</Code>
    : <DrawnRun key={segment.word} run={segment} x={x} y={y}/>)}
</>;

const ClassListDrawing: FC = () =>
  <svg className="class-list-drawing center ink-filled" viewBox="0 0 320 112" aria-hidden="true">
    <Line segments={[opening]} y={16}/>
    <Line segments={[nouns, needs]} y={36}/>
    <Line segments={[states, closing]} y={80}/>
  </svg>;

export const ColumnHeaderClassList: FC = () =>
  <figure className="class-list practice-drawing">
    <code className="off-screen monospaced">{tag}</code>
    <ClassListDrawing/>
    <figcaption className="caption">The trades column’s header from the Tables demo, its class list trimmed, read left
      to right: nouns, then needs, then states.
    </figcaption>
  </figure>;
