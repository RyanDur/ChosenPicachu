import {FC} from 'react';
import './PagePulledApart.css';

type Spot = {readonly u: number; readonly v: number};
type Region = Spot & {readonly across: number; readonly down: number};
type Lettered = Spot & {readonly word: string; readonly anchor?: 'end'};
type Point = {readonly x: number; readonly y: number};

const unitsPerStep = 2.4;
const tilt = 0.42;
const cosine30 = 0.866;
const lift = 82;
const slabDepth = 6;
const projectionStart: Point = {x: 150, y: 170};
const plate: Region = {u: 0, v: 0, across: 112, down: 70};

const elevations = {structure: 0, presentation: lift, behavior: lift * 2};

const projected = ({u, v}: Spot, elevation: number): Point =>
  ({
    x: (projectionStart.x + (u - v) * cosine30) * unitsPerStep,
    y: (projectionStart.y + (u + v) * tilt - elevation) * unitsPerStep
  });

const pointsOf = (corners: readonly Point[]): string => corners.map(({x, y}) => `${x},${y}`).join(' ');

const regionPoints = ({u, v, across, down}: Region, elevation: number): string => pointsOf(
  [{u, v}, {u: u + across, v}, {u: u + across, v: v + down}, {u, v: v + down}]
    .map(corner => projected(corner, elevation)));

const face = (from: Spot, to: Spot): string => pointsOf([
  projected(from, elevations.structure), projected(to, elevations.structure),
  projected(to, elevations.structure - slabDepth), projected(from, elevations.structure - slabDepth)]);

const slabRegions: Readonly<Record<string, Region>> = {
  header: {u: 6, v: 6, across: 102, down: 12},
  section: {u: 6, v: 22, across: 32, down: 42},
  nav: {u: 8, v: 24, across: 28, down: 25},
  button: {u: 8, v: 52, across: 28, down: 10},
  main: {u: 42, v: 22, across: 66, down: 42}
};

const dialog: Region = {u: 6, v: 22, across: 32, down: 26};

const clickSpot: Spot = {u: 33, v: 57};

const regionLettering: readonly Lettered[] = [
  {word: 'header', u: 8, v: 18},
  {word: 'section', u: -4, v: 58, anchor: 'end'},
  {word: 'nav', u: 22.5, v: 42},
  {word: 'button', u: 30, v: 57.5, anchor: 'end'},
  {word: 'main', u: 60.5, v: 50}
];

const classLettering: readonly Lettered[] = [
  {word: '.field', u: -4, v: 58, anchor: 'end'},
  {word: '.paragraph', u: 124, v: 75},
  {word: '.signpost', u: 138, v: 89}
];

const scriptLettering: readonly Lettered[] = [
  {word: 'dialog', u: 19.5, v: 44.5},
  {word: 'click', u: clickSpot.u + 7, v: clickSpot.v + 3}
];

const backCorner: Spot = {u: 0, v: 0};
const frontCorner: Spot = {u: plate.across, v: plate.down};

const DroppedLine: FC<{spot: Spot}> = ({spot}) => {
  const onTheScript = projected(spot, elevations.behavior);
  const onTheSlab = projected(spot, elevations.structure);
  return <line className="drawn-line drawn dashed-drawn" x1={onTheScript.x} y1={onTheScript.y} x2={onTheSlab.x}
    y2={onTheSlab.y}/>;
};

const languages = [
  {word: 'behavior', elevation: elevations.behavior},
  {word: 'presentation', elevation: elevations.presentation},
  {word: 'structure', elevation: elevations.structure}
];

const Lettering: FC<{lettering: readonly Lettered[]; elevation: number}> = ({lettering, elevation}) => <>
  {lettering.map(lettered => <text key={lettered.word} className="drawn-caption monospaced ink-filled"
    {...projected(lettered, elevation)} textAnchor={lettered.anchor}>
    {lettered.word}
  </text>)}
</>;

export const PagePulledApart: FC = () => {
  const clickPoint = projected(clickSpot, elevations.behavior);
  return <figure className="page-pulled-apart">
    <svg className="drawing center" viewBox={`${25 * unitsPerStep} 0 ${230 * unitsPerStep} ${258 * unitsPerStep}`}
      width={230 * unitsPerStep}
      height={258 * unitsPerStep} aria-hidden="true">
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
      <polygon className="slab-line drawn paper-filled" points={regionPoints(plate, elevations.structure)}/>
      {Object.entries(slabRegions).map(([name, region]) =>
        <polygon key={name} className="drawn-line drawn hollow" points={regionPoints(region, elevations.structure)}/>)}
      <polygon className="drawn-line drawn paper-filled" points={regionPoints(plate, elevations.presentation)}/>
      {Object.entries(slabRegions).map(([name, region]) =>
        <polygon key={name} className="drawn-line drawn pulled-apart-hatched"
          points={regionPoints(region, elevations.presentation)}/>)}
      <polygon className="drawn-line drawn paper-filled" points={regionPoints(plate, elevations.behavior)}/>
      <polygon className="drawn-line drawn hollow" points={regionPoints(dialog, elevations.behavior)}/>
      <DroppedLine spot={frontCorner}/>
      <DroppedLine spot={clickSpot}/>
      <circle className="drawn-filled" cx={clickPoint.x} cy={clickPoint.y} r={1.6 * unitsPerStep}/>
      <Lettering lettering={regionLettering} elevation={elevations.structure}/>
      <Lettering lettering={classLettering} elevation={elevations.presentation}/>
      <Lettering lettering={scriptLettering} elevation={elevations.behavior}/>
      {languages.map(({word, elevation}) => {
        const {x, y} = projected({u: 0, v: plate.down / 2}, elevation);
        return <text key={word} className="drawn-caption uppercase ink-filled" x={x - 6 * unitsPerStep}
          y={y - 6 * unitsPerStep}
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
