import {FC} from 'react';
import './PagePulledApart.css';

type Spot = {readonly u: number; readonly v: number};
type Region = Spot & {readonly across: number; readonly down: number};
type Point = {readonly x: number; readonly y: number};

const unitsPerStep = 2.4;
const tilt = 0.42;
const cosine30 = 0.866;
const lift = 82;
const slabDepth = 6;
const projectionStart: Point = {x: 150, y: 170};
const plate: Region = {u: 0, v: 0, across: 112, down: 78};

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
  header: {u: 6, v: 6, across: 100, down: 12},
  nav: {u: 6, v: 22, across: 24, down: 40},
  main: {u: 34, v: 22, across: 72, down: 40},
  footer: {u: 6, v: 66, across: 100, down: 6},
  button: {u: 80, v: 50, across: 22, down: 8}
};

const centerOf = ({u, v, across, down}: Region): Spot => ({u: u + across / 2, v: v + down / 2 + 1.8});

const scriptPoints: Readonly<Record<string, Spot>> = {
  toggle: {u: 18, v: 42},
  click: {u: 91, v: 54}
};

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

const Lettering: FC<{word: string; place: Point; anchor?: 'middle'}> = ({word, place, anchor}) =>
  <text className="drawn-caption monospaced ink-filled paper-haloed" {...place} textAnchor={anchor}>{word}</text>;

export const PagePulledApart: FC = () =>
  <figure className="page-pulled-apart">
    <svg className="drawing center" viewBox={`${35 * unitsPerStep} 0 ${215 * unitsPerStep} ${258 * unitsPerStep}`}
      width={215 * unitsPerStep}
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
      {Object.entries(scriptPoints).map(([word, spot]) => {
        const {x, y} = projected(spot, elevations.behavior);
        return <circle key={word} className="drawn-filled" cx={x} cy={y} r={1.6 * unitsPerStep}/>;
      })}
      {Object.values(scriptPoints).map(spot => <DroppedLine key={`${spot.u},${spot.v}`} spot={spot}/>)}
      <DroppedLine spot={frontCorner}/>
      {Object.entries(slabRegions).map(([name, region]) =>
        <Lettering key={name} word={name} place={projected(centerOf(region), elevations.structure)} anchor="middle"/>)}
      {Object.entries(scriptPoints).map(([word, {u, v}]) =>
        <Lettering key={word} word={word} place={projected({u: u + 3, v: v + 1}, elevations.behavior)}/>)}
      {languages.map(({word, elevation}) => {
        const {x, y} = projected({u: 0, v: plate.down / 2}, elevation);
        return <text key={word} className="drawn-caption uppercase ink-filled paper-haloed" x={x - 6 * unitsPerStep}
          y={y + 2 * unitsPerStep} textAnchor="end">{word}</text>;
      })}
    </svg>
    <figcaption className="caption"><strong className="bold">A page, pulled apart.</strong> The markup is the slab, the
      one plate that is a page on its own. The style sheet dresses every region of it. The script touches two points.
      Lift the style sheet or the script off and the page still stands: that is separate. Set them back and every mark
      lands on its element: that is together.
    </figcaption>
  </figure>;
