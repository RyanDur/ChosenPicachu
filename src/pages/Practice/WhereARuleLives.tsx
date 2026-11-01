import {FC} from 'react';
import './WhereARuleLives.css';

type Box = {
  readonly label: string;
  readonly look: string;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
};

type Line = {
  readonly from: readonly [number, number];
  readonly to: readonly [number, number];
  readonly labelAt: readonly [number, number];
};

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
  {label: 'src/styles', look: folder, x, y, width: 210, height: 282},
  {label: 'the reset and the tokens', look: group, x: x + 9, y: y + 24, width: 192, height: 90},
  ...column(sharedSheets.slice(0, 3), file, {x: x + 18, y: y + 42, width: 174}),
  {label: 'the vocabulary, by concern', look: group, x: x + 9, y: y + 120, width: 192, height: 156},
  ...column(sharedSheets.slice(3), file, {x: x + 18, y: y + 138, width: 174})
];

const component = (x: number, y: number, besideEachOther: boolean): Box[] => [
  {label: 'DragSortableTable', look: folder, x, y, width: besideEachOther ? 288 : 222, height: besideEachOther ? 138 : 282},
  ...column(parts, file, {x: x + 12, y: y + 24, width: 126}),
  ...column(ownSheets, sheet, besideEachOther ? {x: x + 150, y: y + 24, width: 126} : {x: x + 12, y: y + 138, width: 126})
];

const liftedIn = (surface: Box): {x: number; y: number} => ({x: surface.x + surface.width - 48, y: surface.y + inset});

const wide: Box[] = [...tree(6, 6), ...component(246, 6, false)];
const stacked: Box[] = [...tree(6, 6), ...component(6, 306, true)];

const wears: Record<'wide' | 'stacked', Line> = {
  wide: {from: [198, 201], to: [258, 87], labelAt: [214, 150]},
  stacked: {from: [198, 201], to: [144, 387], labelAt: [176, 290]}
};

const DrawnBox: FC<{box: Box; lifted: boolean}> = ({box, lifted}) => <>
  <rect className={box.look} x={box.x} y={box.y} width={box.width} height={box.height}/>
  <text className="drawn-caption" x={box.x + inset} y={box.y + inset} dominantBaseline="hanging">{box.label}</text>
  {lifted && <text className="drawn-caption" x={liftedIn(box).x} y={liftedIn(box).y} dominantBaseline="hanging">lifted</text>}
</>;

const Frame: FC<{boxes: Box[]; line: Line; className: string; viewBox: string}> = ({boxes, line, className, viewBox}) =>
  <svg className={`${className} ink-filled`} viewBox={viewBox} aria-hidden="true">
    {boxes.map(box => <DrawnBox key={box.label} box={box} lifted={box.label === 'surface'}/>)}
    <line className="wears-line drawn dashed-drawn" x1={line.from[0]} y1={line.from[1]} x2={line.to[0]} y2={line.to[1]}/>
    <text className="drawn-caption" x={line.labelAt[0]} y={line.labelAt[1]} dominantBaseline="hanging">wears</text>
  </svg>;

export const WhereARuleLives: FC = () =>
  <figure className="where-a-rule-lives">
    <Frame boxes={wide} line={wears.wide} className="where-a-rule-lives-wide center" viewBox="0 0 480 294"/>
    <Frame boxes={stacked} line={wears.stacked} className="where-a-rule-lives-stacked center" viewBox="0 0 300 450"/>
    <figcaption className="caption"><strong className="bold">Where a rule lives.</strong> Shared words at the root, by
      concern; a component’s structure beside the component.
    </figcaption>
  </figure>;
