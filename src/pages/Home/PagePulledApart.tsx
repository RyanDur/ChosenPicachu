import {FC} from 'react';
import './PagePulledApart.css';

type Spot = {readonly u: number; readonly v: number};
type Region = Spot & {readonly across: number; readonly down: number};
type Mark = Spot & {readonly word: string; readonly anchor?: 'middle' | 'end'};
type Point = {readonly x: number; readonly y: number};

const scale = 2.4;
const tilt = 0.42;
const cosine30 = 0.866;
const lift = 82;
const slabDepth = 6;
const origin: Point = {x: 150, y: 170};
const plate: Region = {u: 0, v: 0, across: 112, down: 70};

const heights = {structure: 0, presentation: lift, behavior: lift * 2};

const at = ({u, v}: Spot, height: number): Point =>
  ({x: (origin.x + (u - v) * cosine30) * scale, y: (origin.y + (u + v) * tilt - height) * scale});

const pointsOf = (corners: readonly Point[]): string => corners.map(({x, y}) => `${x},${y}`).join(' ');

const outline = ({u, v, across, down}: Region, height: number): string => pointsOf(
  [{u, v}, {u: u + across, v}, {u: u + across, v: v + down}, {u, v: v + down}].map(corner => at(corner, height)));

const face = (from: Spot, to: Spot): string => pointsOf([
  at(from, heights.structure), at(to, heights.structure),
  at(to, heights.structure - slabDepth), at(from, heights.structure - slabDepth)]);

const regions: Readonly<Record<string, Region>> = {
  header: {u: 6, v: 6, across: 102, down: 12},
  nav: {u: 6, v: 22, across: 32, down: 42},
  main: {u: 42, v: 22, across: 66, down: 42},
  button: {u: 8, v: 52, across: 28, down: 10},
  dialog: {u: 68, v: 44, across: 36, down: 16}
};

const regionNames: readonly Mark[] = [
  {word: 'header', u: 22, v: 14},
  {word: 'nav', u: 23.5, v: 41.5},
  {word: 'main', u: 54.5, v: 44},
  {word: 'button', u: 30, v: 57.5, anchor: 'end'},
  {word: 'dialog', u: 69, v: 58}
];

const classNames: readonly Mark[] = [
  {word: '.paragraph', u: 62, v: -4},
  {word: '.signpost', u: 114, v: 46},
  {word: '.field', u: -2, v: 58, anchor: 'end'}
];

const commands: readonly Spot[] = [{u: 33, v: 57}, {u: 100, v: 52}];

const commandNames: readonly Mark[] = [
  {word: 'show-modal', u: 36, v: 58},
  {word: 'close', u: 96.5, v: 48.5, anchor: 'middle'}
];

const plateCorners: readonly Spot[] = [{u: 0, v: 0}, {u: plate.across, v: plate.down}];

const DroppedLine: FC<{spot: Spot}> = ({spot}) => {
  const top = at(spot, heights.behavior);
  const bottom = at(spot, heights.structure);
  return <line className="drawn-line drawn dashed-drawn" x1={top.x} y1={top.y} x2={bottom.x} y2={bottom.y}/>;
};

const languages = [
  {word: 'behavior', height: heights.behavior},
  {word: 'presentation', height: heights.presentation},
  {word: 'structure', height: heights.structure}
];

const Lettering: FC<{marks: readonly Mark[]; height: number}> = ({marks, height}) => <>
  {marks.map(mark => <text key={mark.word} className="drawn-caption monospaced ink-filled" {...at(mark, height)}
    textAnchor={mark.anchor}>
    {mark.word}
  </text>)}
</>;

export const PagePulledApart: FC = () =>
  <figure className="page-pulled-apart">
    <svg className="drawing" viewBox={`${50 * scale} 0 ${200 * scale} ${258 * scale}`} width={200 * scale}
      height={258 * scale} aria-hidden="true">
      <defs>
        <pattern id="page-pulled-apart-hatch" patternUnits="userSpaceOnUse" width="7" height="7"
          patternTransform="rotate(135)">
          <line className="drawn-line drawn" x1="0" y1="0" x2="0" y2="7"/>
        </pattern>
      </defs>
      {plateCorners.map(corner => <DroppedLine key={`${corner.u},${corner.v}`} spot={corner}/>)}
      <polygon className="slab-line drawn paper-filled"
        points={face({u: 0, v: plate.down}, {u: plate.across, v: plate.down})}/>
      <polygon className="slab-line drawn paper-filled"
        points={face({u: plate.across, v: 0}, {u: plate.across, v: plate.down})}/>
      <polygon className="slab-line drawn paper-filled" points={outline(plate, heights.structure)}/>
      {Object.entries(regions).map(([name, region]) =>
        <polygon key={name} className="drawn-line drawn hollow" points={outline(region, heights.structure)}/>)}
      <polygon className="drawn-line drawn paper-filled" points={outline(plate, heights.presentation)}/>
      {Object.entries(regions).map(([name, region]) =>
        <polygon key={name} className={`drawn-line drawn ${name === 'main' ? 'hollow' : 'hatched-filled'}`}
          points={outline(region, heights.presentation)}/>)}
      <polygon className="drawn-line drawn paper-filled" points={outline(plate, heights.behavior)}/>
      {commands.map(command => <DroppedLine key={`${command.u},${command.v}`} spot={command}/>)}
      {commands.map(command => {
        const {x, y} = at(command, heights.behavior);
        return <circle key={`${command.u},${command.v}`} className="drawn-filled" cx={x} cy={y} r={1.6 * scale}/>;
      })}
      <Lettering marks={regionNames} height={heights.structure}/>
      <Lettering marks={classNames} height={heights.presentation}/>
      <Lettering marks={commandNames} height={heights.behavior}/>
      {languages.map(({word, height}) => {
        const {x, y} = at({u: 0, v: plate.down / 2}, height);
        return <text key={word} className="drawn-caption uppercase ink-filled" x={x - 6 * scale} y={y + 2 * scale}
          textAnchor="end">{word}</text>;
      })}
    </svg>
    <figcaption className="caption"><strong className="bold">A page, pulled apart.</strong> The markup is the slab, the
      one plate that is a page on its own. The style sheet dresses every region of it. The script touches two points.
      Lift the style sheet or the script off and the page still stands: that is separate. Set them back and every mark
      lands on its element: that is together.
    </figcaption>
  </figure>;
