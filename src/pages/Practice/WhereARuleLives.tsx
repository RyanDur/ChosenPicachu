import {FC} from 'react';
import './PracticeDrawing.css';
import './WhereARuleLives.css';

type Box = {
  readonly label: string;
  readonly look: string;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
};

type Point = {readonly x: number; readonly y: number};

const inset = 6;

const folder = 'folder-box hollow drawn';
const group = 'group-box hollow drawn';
const file = 'file-box hollow drawn';
const sheet = 'sheet-box hollow drawn';

const sharedSheets = ['reset', 'colors', 'spacing', 'button', 'typography', 'surface', 'drawing', 'placement', 'glide'];
const parts = ['DraggableColumn.tsx', 'RowGrip.tsx', 'SortMenu.tsx', 'ResizeHandle.tsx'];
const ownSheets = ['Table.css', 'Header.css', 'RowGrip.css'];

type Column = {readonly x: number; readonly y: number; readonly width: number};

const column = (labels: string[], look: string, {x, y, width}: Column): Box[] =>
  labels.map((label, at) => ({label, look, x, y: y + at * 24, width, height: 18}));

const tree = (x: number, y: number): Box[] => [
  {label: 'src/styles', look: folder, x, y, width: 210, height: 288},
  {label: 'the reset and the tokens', look: group, x: x + 9, y: y + 24, width: 192, height: 90},
  ...column(sharedSheets.slice(0, 3), file, {x: x + 18, y: y + 42, width: 174}),
  {label: 'the vocabulary, by concern', look: group, x: x + 9, y: y + 120, width: 192, height: 162},
  ...column(sharedSheets.slice(3), file, {x: x + 18, y: y + 138, width: 174})
];

const component = (x: number, y: number, besideEachOther: boolean): Box[] => [
  {label: 'DragSortableTable', look: folder, x, y, width: besideEachOther ? 288 : 222, height: besideEachOther ? 138 : 288},
  ...column(parts, file, {x: x + 12, y: y + 24, width: 126}),
  ...column(ownSheets, sheet, besideEachOther ? {x: x + 150, y: y + 24, width: 126} : {x: x + 12, y: y + 138, width: 126})
];

const liftedIn = (surface: Box): Point => ({x: surface.x + surface.width - 48, y: surface.y + inset});

const boxLabelled = (boxes: Box[], label: string): Box => {
  const found = boxes.find(box => box.label === label);
  if (found) {
    return found;
  }
  throw new Error(`no box labelled ${label}`);
};

const rightMiddle = ({x, y, width, height}: Box): Point => ({x: x + width, y: y + height / 2});
const leftMiddle = ({x, y, height}: Box): Point => ({x, y: y + height / 2});
const topMiddle = ({x, y, width}: Box): Point => ({x: x + width / 2, y});

const margin = 6;

const viewBoxAround = (boxes: Box[]): string =>
  `0 0 ${Math.max(...boxes.map(({x, width}) => x + width)) + margin} ${Math.max(...boxes.map(({y, height}) => y + height)) + margin}`;

const wide: Box[] = [...tree(6, 6), ...component(252, 6, false)];
const stacked: Box[] = [...tree(6, 6), ...component(6, 306, true)];

const wearsBeside = (boxes: Box[]): {from: Point; to: Point} =>
  ({from: rightMiddle(boxLabelled(boxes, 'surface')), to: leftMiddle(boxLabelled(boxes, 'SortMenu.tsx'))});

const wearsBelow = (boxes: Box[]): {from: Point; to: Point} =>
  ({from: rightMiddle(boxLabelled(boxes, 'surface')), to: topMiddle(boxLabelled(boxes, 'SortMenu.tsx'))});

const DrawnBox: FC<{box: Box; lifted: boolean}> = ({box, lifted}) => <>
  <rect className={box.look} x={box.x} y={box.y} width={box.width} height={box.height}/>
  <text className="drawn-caption" x={box.x + inset} y={box.y + inset} dominantBaseline="hanging">{box.label}</text>
  {lifted && <text className="drawn-caption" x={liftedIn(box).x} y={liftedIn(box).y} dominantBaseline="hanging">lifted</text>}
</>;

const Frame: FC<{boxes: Box[]; wears: {from: Point; to: Point}; className: string}> = ({boxes, wears: {from, to}, className}) =>
  <svg className={`${className} ink-filled`} viewBox={viewBoxAround(boxes)} aria-hidden="true">
    {boxes.map(box => <DrawnBox key={box.label} box={box} lifted={box.label === 'surface'}/>)}
    <line className="wears-line drawn dashed-drawn" x1={from.x} y1={from.y} x2={to.x} y2={to.y}/>
    <text className="drawn-caption" x={(from.x + to.x) / 2 + inset} y={(from.y + to.y) / 2} dominantBaseline="hanging">wears</text>
  </svg>;

export const WhereARuleLives: FC = () =>
  <figure className="where-a-rule-lives practice-drawing">
    <Frame boxes={wide} wears={wearsBeside(wide)} className="drawing-wide center"/>
    <Frame boxes={stacked} wears={wearsBelow(stacked)} className="drawing-stacked center"/>
    <figcaption className="caption"><strong className="bold">Where a rule lives.</strong> The shared words live at the root,
      by concern. A component’s structure lives beside the component.
    </figcaption>
  </figure>;
