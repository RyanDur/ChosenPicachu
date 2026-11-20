export type Spot = {readonly u: number; readonly v: number};
export type Region = Spot & {readonly across: number; readonly down: number};
export type Point = {readonly x: number; readonly y: number};
export type MotionKind = 'turning' | 'rippling';

const plate: Region = {u: 0, v: 0, across: 112, down: 72};

const markupLines = [
  '<header class="app-header">',
  '  <h1>…</h1>',
  '</header>',
  '<nav class="rail" id="pages" popover>…</nav>',
  '<button popovertarget="pages">Menu</button>',
  '<main class="app-main">',
  '  <article>',
  '    <table class="table">…</table>',
  '  </article>',
  '</main>'
];

const inset = 6;
const edgeClearance = 5;
const longestLine = Math.max(...markupLines.map(line => line.length));
const advance = (plate.across - inset - edgeClearance) / longestLine;
const firstBaseline = 10;
const lineStep = 6.2;
const letterWidth = 0.6;
const letterSize = advance / letterWidth;
const halfLetterHeight = letterSize * 0.4;

const baselineOf = (row: number): number => firstBaseline + row * lineStep;

const ellipsisInside = (tag: string): Spot => {
  const row = markupLines.findIndex(written => written.trimStart().startsWith(`<${tag}`));
  return {
    u: inset + (markupLines[row].indexOf('…') + 0.5) * advance,
    v: baselineOf(row) - halfLetterHeight
  };
};

const widthOf = (words: string, fontSize: number): number => words.length * fontSize * letterWidth;

const startOf = (line: string): number => inset + (line.length - line.trimStart().length) * advance;

const lengthOf = (line: string): number => line.trim().length * advance;

const regions = [
  {
    name: '.rail', tint: 'plan-mint-filled', footprint: {u: 4, v: 4, across: 26, down: 64},
    namedAt: {u: 11.6, v: 44.8}, namedFlatAt: {u: 17, v: 26}
  },
  {
    name: '.app-header', tint: 'plan-sand-filled', footprint: {u: 34, v: 4, across: 74, down: 12},
    namedAt: {u: 56.1, v: 27.6}, namedFlatAt: {u: 71, v: 11.5}
  },
  {
    name: '.app-main', tint: 'plan-blue-filled', footprint: {u: 34, v: 20, across: 74, down: 48},
    namedAt: {u: 36.5, v: 65.3}, namedFlatAt: {u: 49, v: 65}
  },
  {
    name: '.table', tint: 'plan-rose-filled', footprint: {u: 42, v: 28, across: 58, down: 30},
    namedAt: {u: 63.1, v: 53.2}, namedFlatAt: {u: 71, v: 44.5}
  }
];

const events: readonly {word: string; call: string; spark: Spot; landsOn: Spot; motion: MotionKind}[] = [
  {word: 'toggle', call: 'addEventListener("toggle", …)', spark: {u: 16, v: 26}, landsOn: ellipsisInside('nav'), motion: 'turning'},
  {word: 'click', call: 'rows.sort(by(column))', spark: {u: 70, v: 40}, landsOn: ellipsisInside('table'), motion: 'rippling'}
];

export const thePage = {plate, markupLines, letterSize, baselineOf, startOf, lengthOf, widthOf, regions, events};
