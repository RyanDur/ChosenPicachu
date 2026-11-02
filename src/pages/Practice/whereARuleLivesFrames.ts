type Box = {
  readonly label: string;
  readonly look: string;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
};

type Point = {readonly x: number; readonly y: number};

type Wears = {readonly from: Point; readonly to: Point};

export type Size = {readonly width: number; readonly height: number};

export type Frame = {readonly svg: string; readonly size: Size};

const inset = 6;

const folder = 'folder-box hollow drawn';
const group = 'group-box hollow drawn';
const file = 'file-box hollow drawn';
const sheet = 'sheet-box hollow drawn';

const tokens = ['reset', 'colors', 'spacing'] as const;
const vocabulary = ['button', 'typography', 'surface', 'drawing', 'placement', 'glide'] as const;
const parts = ['DraggableColumn.tsx', 'RowGrip.tsx', 'SortMenu.tsx', 'ResizeHandle.tsx'] as const;
const ownSheets = ['Table.css', 'Header.css', 'RowGrip.css'] as const;

type Column = {readonly x: number; readonly y: number; readonly width: number; readonly look: string};

const row = (label: string, {x, y, width, look}: Column, at: number): Box => ({label, look, x, y: y + at * 24, width, height: 18});

const column = (labels: readonly string[], placed: Column): Box[] => labels.map((label, at) => row(label, placed, at));

const rowOf = <Label extends string>(labels: readonly Label[], label: Label, placed: Column): Box =>
  row(label, placed, labels.indexOf(label));

const tree = (x: number, y: number): {boxes: Box[]; surface: Box} => {
  const words: Column = {x: x + 18, y: y + 138, width: 174, look: file};
  return {
    boxes: [
      {label: 'src/styles', look: folder, x, y, width: 210, height: 288},
      {label: 'the reset and the tokens', look: group, x: x + 9, y: y + 24, width: 192, height: 90},
      ...column(tokens, {x: x + 18, y: y + 42, width: 174, look: file}),
      {label: 'the vocabulary, by concern', look: group, x: x + 9, y: y + 120, width: 192, height: 162},
      ...column(vocabulary, words)
    ],
    surface: rowOf(vocabulary, 'surface', words)
  };
};

const component = (x: number, y: number, besideEachOther: boolean): {boxes: Box[]; sortMenu: Box} => {
  const files: Column = {x: x + 12, y: y + 24, width: 126, look: file};
  const sheets: Column = besideEachOther ? {x: x + 150, y: y + 24, width: 126, look: sheet} : {x: x + 12, y: y + 138, width: 126, look: sheet};
  return {
    boxes: [
      {label: 'DragSortableTable', look: folder, x, y, width: besideEachOther ? 288 : 222, height: besideEachOther ? 138 : 288},
      ...column(parts, files),
      ...column(ownSheets, sheets)
    ],
    sortMenu: rowOf(parts, 'SortMenu.tsx', files)
  };
};

const liftedIn = (surface: Box): Point => ({x: surface.x + surface.width - 48, y: surface.y + inset});

const rightMiddle = ({x, y, width, height}: Box): Point => ({x: x + width, y: y + height / 2});
const leftMiddle = ({x, y, height}: Box): Point => ({x, y: y + height / 2});
const topMiddle = ({x, y, width}: Box): Point => ({x: x + width / 2, y});

const margin = 6;

const sizeAround = (boxes: Box[]): Size => ({
  width: Math.max(...boxes.map(({x, width}) => x + width)) + margin,
  height: Math.max(...boxes.map(({y, height}) => y + height)) + margin
});

const styles = tree(6, 6);

const wideComponent = component(252, 6, false);
const wide: Box[] = [...styles.boxes, ...wideComponent.boxes];
const wideWears: Wears = {from: rightMiddle(styles.surface), to: leftMiddle(wideComponent.sortMenu)};

const stackedComponent = component(6, 306, true);
const stacked: Box[] = [...styles.boxes, ...stackedComponent.boxes];
const stackedWears: Wears = {from: rightMiddle(styles.surface), to: topMiddle(stackedComponent.sortMenu)};

const caption = (words: string, {x, y}: Point): string =>
  `<text class="drawn-caption" x="${x}" y="${y}" dominant-baseline="hanging">${words}</text>`;

const drawnBox = (box: Box, lifted: boolean): string =>
  `<rect class="${box.look}" x="${box.x}" y="${box.y}" width="${box.width}" height="${box.height}"/>` +
  caption(box.label, {x: box.x + inset, y: box.y + inset}) +
  (lifted ? caption('lifted', liftedIn(box)) : '');

export const squeezed = (css: string): string => css
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\s+/g, ' ')
  .replace(/\s*([{};])\s*/g, '$1');

// an image cannot read the page's style sheets, so each frame carries the site's own, and measures its column by its own width
const frame = (boxes: Box[], {from, to}: Wears, siteStyle: string): Frame => {
  const size = sizeAround(boxes);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" class="where-a-rule-lives ink-filled" viewBox="0 0 ${size.width} ${size.height}" width="${size.width}" height="${size.height}">` +
    `<style><![CDATA[${siteStyle}:root{--drawing-column:100vw;--drawn-width:${size.width}px;}]]></style>` +
    boxes.map(box => drawnBox(box, box.label === styles.surface.label)).join('') +
    `<line class="wears-line drawn dashed-drawn" x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}"/>` +
    caption('wears', {x: (from.x + to.x) / 2 + inset, y: (from.y + to.y) / 2}) +
    '</svg>';
  return {svg, size};
};

export const whereARuleLivesSizes = {wide: sizeAround(wide), stacked: sizeAround(stacked)};

export const whereARuleLivesFrames = (siteStyle: string): {wide: Frame; stacked: Frame} => ({
  wide: frame(wide, wideWears, siteStyle),
  stacked: frame(stacked, stackedWears, siteStyle)
});
