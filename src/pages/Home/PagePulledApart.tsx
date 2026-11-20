import {FC, Fragment, PropsWithChildren, useId} from 'react';
import {EventWord, MarkupLines, motions, Region, SheetRegion, Spot, thePage, TurnHead} from './plates';
import './PagePulledApart.css';

type Point = {readonly x: number; readonly y: number};

const unitsPerStep = 2.4;
const tilt = 0.42;
const cosine30 = 0.866;
const lift = 82;
const slabDepth = 6;
const projectionStart: Point = {x: 150, y: 170};

const elevations = {structure: 0, presentation: lift, behavior: lift * 2};

const projected = ({u, v}: Spot, elevation: number): Point =>
  ({
    x: (projectionStart.x + (u - v) * cosine30) * unitsPerStep,
    y: (projectionStart.y + (u + v) * tilt - elevation) * unitsPerStep
  });

const onThePlateAt = (elevation: number): string => {
  const origin = projected({u: 0, v: 0}, elevation);
  const alongU = projected({u: 1, v: 0}, elevation);
  const alongV = projected({u: 0, v: 1}, elevation);
  return [
    alongU.x - origin.x, alongU.y - origin.y,
    alongV.x - origin.x, alongV.y - origin.y,
    origin.x, origin.y
  ].join(' ');
};

const pointsOf = (corners: readonly Point[]): string => corners.map(({x, y}) => `${x},${y}`).join(' ');

const regionPoints = ({u, v, across, down}: Region, elevation: number): string => pointsOf(
  [{u, v}, {u: u + across, v}, {u: u + across, v: v + down}, {u, v: v + down}]
    .map(corner => projected(corner, elevation)));

const face = (from: Spot, to: Spot): string => pointsOf([
  projected(from, elevations.structure), projected(to, elevations.structure),
  projected(to, elevations.structure - slabDepth), projected(from, elevations.structure - slabDepth)]);

const sparkRadius = 1.6 * unitsPerStep;
const ellipseRatio = 0.5;
const turnHeadWidth = 5;

const ellipsisInside = (tag: string): Spot => {
  const row = thePage.markupLines.findIndex(written => written.trimStart().startsWith(`<${tag}`));
  return thePage.letterAt(row, thePage.markupLines[row].indexOf('…'));
};

const landings: Record<EventWord, Spot> = {toggle: ellipsisInside('nav'), click: ellipsisInside('table')};

const regionNamedAt: Record<SheetRegion, Spot> = {
  '.rail': {u: 11.6, v: 44.8},
  '.app-header': {u: 56.1, v: 27.6},
  '.app-main': {u: 36.5, v: 65.3},
  '.table': {u: 63.1, v: 53.2}
};

const nameLineOf = ({y}: Point): number => y + sparkRadius * 0.6;

const languages = [
  {word: 'behavior', elevation: elevations.behavior},
  {word: 'presentation', elevation: elevations.presentation},
  {word: 'structure', elevation: elevations.structure}
];

type Lettering = FC<PropsWithChildren<Point>>;

const RegionName: Lettering = ({x, y, children}) =>
  <text className="drawn-caption monospaced ink-filled paper-haloed thin-haloed" x={x} y={y}>{children}</text>;

const Call: Lettering = ({x, y, children}) =>
  <text className="drawn-caption monospaced ink-filled paper-haloed" x={x} y={y} dy="1.5em" textAnchor="middle">
    {children}
  </text>;

const EventName: Lettering = ({x, y, children}) =>
  <text className="drawn-caption monospaced markup-attribute-filled paper-haloed" x={x} y={y}>{children}</text>;

export const PagePulledApart: FC = () => {
  const turnHead = useId();
  return <figure className="page-pulled-apart">
    <svg className="drawing center" viewBox={`${35 * unitsPerStep} 0 ${215 * unitsPerStep} ${258 * unitsPerStep}`}
      width={215 * unitsPerStep}
      height={258 * unitsPerStep} aria-hidden="true">
      <TurnHead id={turnHead} markerWidth={turnHeadWidth}/>
      <polygon className="slab-line drawn paper-filled"
        points={face({u: 0, v: thePage.plate.down}, {u: thePage.plate.across, v: thePage.plate.down})}/>
      <polygon className="slab-line drawn paper-filled"
        points={face({u: thePage.plate.across, v: 0}, {u: thePage.plate.across, v: thePage.plate.down})}/>
      <polygon className="slab-line drawn paper-filled" points={regionPoints(thePage.plate, elevations.structure)}/>
      <g transform={`matrix(${onThePlateAt(elevations.structure)})`}>
        <MarkupLines/>
      </g>
      <polygon className="drawn-line drawn paper-filled" points={regionPoints(thePage.plate, elevations.presentation)}/>
      {thePage.regions.map(({name, tint, footprint}) =>
        <polygon key={name} className={`drawn-line drawn ${tint}`} points={regionPoints(footprint, elevations.presentation)}/>)}
      {thePage.regions.map(({name}) =>
        <RegionName key={name} {...projected(regionNamedAt[name], elevations.presentation)}>{name}</RegionName>)}
      <polygon className="drawn-line drawn paper-filled" points={regionPoints(thePage.plate, elevations.behavior)}/>
      {thePage.events.map(({word, spark, motion}) => {
        const center = projected(spark, elevations.behavior);
        const Moving = motions[motion];
        return <Fragment key={word}>
          <Moving cx={center.x} cy={center.y} rx={sparkRadius} ry={sparkRadius * ellipseRatio}
            markerEnd={`url(#${turnHead})`}/>
          <circle className="markup-attribute-filled" cx={center.x} cy={center.y} r={sparkRadius}/>
          <EventName x={center.x + sparkRadius * 3.4} y={nameLineOf(center)}>{word}</EventName>
        </Fragment>;
      })}
      {thePage.events.map(({word, spark}) => {
        const above = projected(spark, elevations.behavior);
        const onTheSheet = projected(spark, elevations.presentation);
        const onTheSlab = projected(landings[word], elevations.structure);
        return <Fragment key={word}>
          <polyline className="drawn-line drawn hollow dashed-drawn"
            points={pointsOf([{x: above.x, y: above.y + sparkRadius}, onTheSheet, onTheSlab])}/>
          <circle className="drawn-filled" cx={onTheSheet.x} cy={onTheSheet.y} r={0.9 * unitsPerStep}/>
        </Fragment>;
      })}
      {thePage.events.map(({word, call, spark}) => {
        const center = projected(spark, elevations.behavior);
        return <Call key={word} x={center.x} y={nameLineOf(center)}>{call}</Call>;
      })}
      {languages.map(({word, elevation}) => {
        const {x, y} = projected({u: 0, v: thePage.plate.down / 2}, elevation);
        return <text key={word} className="drawn-caption uppercase ink-filled paper-haloed" x={x - 6 * unitsPerStep}
          y={y + 2 * unitsPerStep} textAnchor="end">{word}</text>;
      })}
    </svg>
    <figcaption className="caption"><strong className="bold">A page, pulled apart.</strong> The markup is the slab. The
      sheet makes the regions. The script touches two points, and each wire finds the element its event fires on. Lift
      the sheet or the script off and the page still stands: that is separate. Set them back and every mark lands on
      its element: that is together.
    </figcaption>
  </figure>;
};
