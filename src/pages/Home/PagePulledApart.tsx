import {FC} from 'react';
import './PagePulledApart.css';

type Spot = {readonly u: number; readonly v: number};
type Region = Spot & {readonly across: number; readonly down: number};
type Label = Spot & {readonly word: string; readonly anchor?: 'end'};
type Point = {readonly x: number; readonly y: number};

const scale = 2.4;
const tilt = 0.42;
const cosine30 = 0.866;
const lift = 82;
const slabDepth = 6;
const origin: Point = {x: 150, y: 170};
const plate: Region = {u: 0, v: 0, across: 112, down: 70};

const heights = {structure: 0, presentation: lift, behavior: lift * 2};

const projected = ({u, v}: Spot, height: number): Point =>
  ({x: (origin.x + (u - v) * cosine30) * scale, y: (origin.y + (u + v) * tilt - height) * scale});

const pointsOf = (corners: readonly Point[]): string => corners.map(({x, y}) => `${x},${y}`).join(' ');

const regionPoints = ({u, v, across, down}: Region, height: number): string => pointsOf(
  [{u, v}, {u: u + across, v}, {u: u + across, v: v + down}, {u, v: v + down}]
    .map(corner => projected(corner, height)));

const face = (from: Spot, to: Spot): string => pointsOf([
  projected(from, heights.structure), projected(to, heights.structure),
  projected(to, heights.structure - slabDepth), projected(from, heights.structure - slabDepth)]);

const slabRegions: Readonly<Record<string, Region>> = {
  header: {u: 6, v: 6, across: 102, down: 12},
  section: {u: 6, v: 22, across: 32, down: 42},
  nav: {u: 8, v: 24, across: 28, down: 25},
  button: {u: 8, v: 52, across: 28, down: 10},
  main: {u: 42, v: 22, across: 66, down: 42}
};

const dialog: Region = {u: 6, v: 22, across: 32, down: 26};

const click: Spot = {u: 33, v: 57};

const regionLabels: readonly Label[] = [
  {word: 'header', u: 22, v: 14},
  {word: 'section', u: -2, v: 58, anchor: 'end'},
  {word: 'nav', u: 22.5, v: 42},
  {word: 'button', u: 30, v: 57.5, anchor: 'end'},
  {word: 'main', u: 60.5, v: 50}
];

const classLabels: readonly Label[] = [
  {word: '.field', u: -2, v: 58, anchor: 'end'},
  {word: '.paragraph', u: 121, v: 72},
  {word: '.signpost', u: 132, v: 83}
];

const scriptLabels: readonly Label[] = [
  {word: 'dialog', u: 19.5, v: 44.5},
  {word: 'click', u: click.u + 3, v: click.v + 1}
];

const backCorner: Spot = {u: 0, v: 0};
const frontCorner: Spot = {u: plate.across, v: plate.down};

const DroppedLine: FC<{spot: Spot}> = ({spot}) => {
  const top = projected(spot, heights.behavior);
  const bottom = projected(spot, heights.structure);
  return <line className="drawn-line drawn dashed-drawn" x1={top.x} y1={top.y} x2={bottom.x} y2={bottom.y}/>;
};

const languages = [
  {word: 'behavior', height: heights.behavior},
  {word: 'presentation', height: heights.presentation},
  {word: 'structure', height: heights.structure}
];

const Lettering: FC<{labels: readonly Label[]; height: number}> = ({labels, height}) => <>
  {labels.map(label => <text key={label.word} className="drawn-caption monospaced ink-filled"
    {...projected(label, height)} textAnchor={label.anchor}>
    {label.word}
  </text>)}
</>;

export const PagePulledApart: FC = () => {
  const clickPoint = projected(click, heights.behavior);
  return <figure className="page-pulled-apart">
    <svg className="drawing center" viewBox={`${50 * scale} 0 ${200 * scale} ${258 * scale}`} width={200 * scale}
      height={258 * scale} aria-hidden="true">
      <defs>
        <pattern id="page-pulled-apart-hatch" patternUnits="userSpaceOnUse" width="7" height="7"
          patternTransform="rotate(135)">
          <line className="drawn-line drawn" x1="3.5" y1="0" x2="3.5" y2="7"/>
        </pattern>
      </defs>
      <DroppedLine spot={backCorner}/>
      <polygon className="slab-line drawn paper-filled"
        points={face({u: 0, v: plate.down}, {u: plate.across, v: plate.down})}/>
      <polygon className="slab-line drawn paper-filled"
        points={face({u: plate.across, v: 0}, {u: plate.across, v: plate.down})}/>
      <polygon className="slab-line drawn paper-filled" points={regionPoints(plate, heights.structure)}/>
      {Object.entries(slabRegions).map(([name, region]) =>
        <polygon key={name} className="drawn-line drawn hollow" points={regionPoints(region, heights.structure)}/>)}
      <polygon className="drawn-line drawn paper-filled" points={regionPoints(plate, heights.presentation)}/>
      {Object.entries(slabRegions).map(([name, region]) =>
        <polygon key={name} className="drawn-line drawn pulled-apart-hatched"
          points={regionPoints(region, heights.presentation)}/>)}
      <polygon className="drawn-line drawn paper-filled" points={regionPoints(plate, heights.behavior)}/>
      <polygon className="drawn-line drawn hollow" points={regionPoints(dialog, heights.behavior)}/>
      <DroppedLine spot={frontCorner}/>
      <DroppedLine spot={click}/>
      <circle className="drawn-filled" cx={clickPoint.x} cy={clickPoint.y} r={1.6 * scale}/>
      <Lettering labels={regionLabels} height={heights.structure}/>
      <Lettering labels={classLabels} height={heights.presentation}/>
      <Lettering labels={scriptLabels} height={heights.behavior}/>
      {languages.map(({word, height}) => {
        const {x, y} = projected({u: 0, v: plate.down / 2}, height);
        return <text key={word} className="drawn-caption uppercase ink-filled" x={x - 6 * scale} y={y + 2 * scale}
          textAnchor="end">{word}</text>;
      })}
    </svg>
    <figcaption className="caption"><strong className="bold">A page, pulled apart.</strong> The markup is the slab, the
      one plate that is a page on its own. The style sheet dresses every region of it. The script answers the button
      and adds the dialog. Lift the style sheet or the script off and the page still stands: that is separate. Set them
      back and every mark lands on its element: that is together.
    </figcaption>
  </figure>;
};
