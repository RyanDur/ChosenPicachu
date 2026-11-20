import {FC, Fragment} from 'react';
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
const plate: Region = {u: 0, v: 0, across: 112, down: 72};

const elevations = {structure: 0, presentation: lift, behavior: lift * 2};

const projected = ({u, v}: Spot, elevation: number): Point =>
  ({
    x: (projectionStart.x + (u - v) * cosine30) * unitsPerStep,
    y: (projectionStart.y + (u + v) * tilt - elevation) * unitsPerStep
  });

const onThePlateAt = (elevation: number): string => [
  cosine30 * unitsPerStep, tilt * unitsPerStep,
  -cosine30 * unitsPerStep, tilt * unitsPerStep,
  projectionStart.x * unitsPerStep, (projectionStart.y - elevation) * unitsPerStep
].join(' ');

const pointsOf = (corners: readonly Point[]): string => corners.map(({x, y}) => `${x},${y}`).join(' ');

const regionPoints = ({u, v, across, down}: Region, elevation: number): string => pointsOf(
  [{u, v}, {u: u + across, v}, {u: u + across, v: v + down}, {u, v: v + down}]
    .map(corner => projected(corner, elevation)));

const face = (from: Spot, to: Spot): string => pointsOf([
  projected(from, elevations.structure), projected(to, elevations.structure),
  projected(to, elevations.structure - slabDepth), projected(from, elevations.structure - slabDepth)]);

const markupLines = [
  '<header>',
  '  <h1>…</h1>',
  '</header>',
  '<nav popover>…</nav>',
  '<button popovertarget>Menu</button>',
  '<main>',
  '  <article>',
  '    <table>…</table>',
  '  </article>',
  '</main>'
];

const inset = 6;
const edgeClearance = 5;
const longestLine = Math.max(...markupLines.map(line => line.length));
const advance = (plate.across - inset - edgeClearance) / longestLine;
const firstBaseline = 10;
const lineStep = 6.2;
const midLetter = 1.5;
const letterSize = advance / 0.6;

const baselineOf = (line: number): number => firstBaseline + line * lineStep;

const ellipsisInside = (element: string): Spot => {
  const line = markupLines.findIndex(written => written.trimStart().startsWith(`<${element}`));
  return {
    u: inset + (markupLines[line].indexOf('…') + 0.5) * advance,
    v: baselineOf(line) - midLetter
  };
};

const inks = {
  bracket: 'markup-bracket-filled',
  tag: 'markup-tag-filled',
  attribute: 'markup-attribute-filled',
  words: 'ink-filled'
};

type Token = {readonly ink: keyof typeof inks; readonly text: string};

const tokensOf = (line: string): readonly Token[] => [...line.trim().matchAll(/(<\/?)([a-z0-9]+)((?: [a-z]+)*)(>)|([^<]+|<)/g)]
  .flatMap(([, open, tag, attributes, close, words]): Token[] => words
    ? [{ink: 'words', text: words}]
    : ([
      {ink: 'bracket', text: open},
      {ink: 'tag', text: tag},
      {ink: 'attribute', text: attributes},
      {ink: 'bracket', text: close}
    ] satisfies Token[]).filter(({text}) => text !== ''));

const indentOf = (line: string): number => line.length - line.trimStart().length;

const regions = [
  {name: '.rail', tint: 'plan-mint-filled', area: {u: 4, v: 4, across: 26, down: 64}, namedAt: {u: 11.6, v: 44.8}},
  {name: '.app-header', tint: 'plan-sand-filled', area: {u: 34, v: 4, across: 74, down: 12}, namedAt: {u: 56.1, v: 27.6}},
  {name: '.app-main', tint: 'plan-blue-filled', area: {u: 34, v: 20, across: 74, down: 48}, namedAt: {u: 36.5, v: 65.3}},
  {name: '.table', tint: 'plan-rose-filled', area: {u: 42, v: 28, across: 58, down: 30}, namedAt: {u: 63.1, v: 53.2}}
];

const sparkRadius = 1.6 * unitsPerStep;
const flattened = 0.5;

const Turning: FC<{at: Point}> = ({at: {x, y}}) => <>
  <ellipse className="drawn-line markup-attribute-drawn hollow dotted-drawn" cx={x} cy={y} rx={sparkRadius * 3}
    ry={sparkRadius * 3 * flattened}/>
  <path className="drawn-line markup-attribute-drawn hollow" markerEnd="url(#page-pulled-apart-turn)"
    d={`M ${x - sparkRadius * 2.2} ${y + sparkRadius * 0.6} A ${sparkRadius * 2.2} ${sparkRadius * 2.2} 0 0 1 ${x + sparkRadius * 0.4} ${y - sparkRadius * 2.2}`}/>
</>;

const Rippling: FC<{at: Point}> = ({at: {x, y}}) => <>
  <ellipse className="drawn-line markup-attribute-drawn hollow" cx={x} cy={y} rx={sparkRadius * 2.4}
    ry={sparkRadius * 2.4 * flattened}/>
  <ellipse className="drawn-line markup-attribute-drawn hollow dotted-drawn" cx={x} cy={y} rx={sparkRadius * 4}
    ry={sparkRadius * 4 * flattened}/>
</>;

const events = [
  {word: 'toggle', call: 'addEventListener("toggle", …)', spark: {u: 16, v: 26}, landsOn: ellipsisInside('nav'), Motion: Turning},
  {word: 'sort', call: 'rows.sort(by(column))', spark: {u: 70, v: 40}, landsOn: ellipsisInside('table'), Motion: Rippling}
];

const languages = [
  {word: 'behavior', elevation: elevations.behavior},
  {word: 'presentation', elevation: elevations.presentation},
  {word: 'structure', elevation: elevations.structure}
];

const RegionName: FC<{name: string; place: Point}> = ({name, place}) =>
  <text className="drawn-caption drawn-label monospaced ink-filled paper-haloed thin-haloed" {...place}>{name}</text>;

const Call: FC<{words: string; place: Point}> = ({words, place}) =>
  <text className="drawn-caption drawn-note monospaced ink-filled paper-haloed" {...place} textAnchor="middle">{words}</text>;

const EventName: FC<{word: string; place: Point}> = ({word, place}) =>
  <text className="drawn-caption monospaced markup-attribute-filled paper-haloed" {...place}>{word}</text>;

export const PagePulledApart: FC = () =>
  <figure className="page-pulled-apart">
    <svg className="drawing center" viewBox={`${35 * unitsPerStep} 0 ${215 * unitsPerStep} ${258 * unitsPerStep}`}
      width={215 * unitsPerStep}
      height={258 * unitsPerStep} aria-hidden="true">
      <defs>
        <marker id="page-pulled-apart-turn" viewBox="0 0 6 6" refX="3" refY="3" markerWidth="5" markerHeight="5"
          orient="auto-start-reverse">
          <path className="markup-attribute-filled" d="M 0 0 L 6 3 L 0 6 z"/>
        </marker>
      </defs>
      <polygon className="slab-line drawn paper-filled"
        points={face({u: 0, v: plate.down}, {u: plate.across, v: plate.down})}/>
      <polygon className="slab-line drawn paper-filled"
        points={face({u: plate.across, v: 0}, {u: plate.across, v: plate.down})}/>
      <polygon className="slab-line drawn paper-filled" points={regionPoints(plate, elevations.structure)}/>
      <g className="monospaced" fontSize={letterSize} transform={`matrix(${onThePlateAt(elevations.structure)})`}>
        {markupLines.map((line, index) =>
          <text key={line} x={inset + indentOf(line) * advance} y={baselineOf(index)}
            textLength={line.trim().length * advance} lengthAdjust="spacingAndGlyphs">
            {tokensOf(line).map(({ink, text}, at) => <tspan key={at} className={inks[ink]}>{text}</tspan>)}
          </text>)}
      </g>
      <polygon className="drawn-line drawn paper-filled" points={regionPoints(plate, elevations.presentation)}/>
      {regions.map(({name, tint, area}) =>
        <polygon key={name} className={`drawn-line drawn ${tint}`} points={regionPoints(area, elevations.presentation)}/>)}
      {regions.map(({name, namedAt}) =>
        <RegionName key={name} name={name} place={projected(namedAt, elevations.presentation)}/>)}
      <polygon className="drawn-line drawn paper-filled" points={regionPoints(plate, elevations.behavior)}/>
      {events.map(({word, spark, Motion}) => {
        const at = projected(spark, elevations.behavior);
        return <Fragment key={word}>
          <Motion at={at}/>
          <circle className="markup-attribute-filled" cx={at.x} cy={at.y} r={sparkRadius}/>
          <EventName word={word} place={{x: at.x + sparkRadius * 3.4, y: at.y + sparkRadius * 0.6}}/>
        </Fragment>;
      })}
      {events.map(({word, spark, landsOn}) => {
        const above = projected(spark, elevations.behavior);
        const onTheSheet = projected(spark, elevations.presentation);
        const onTheSlab = projected(landsOn, elevations.structure);
        return <Fragment key={word}>
          <polyline className="drawn-line drawn hollow dashed-drawn"
            points={pointsOf([{x: above.x, y: above.y + sparkRadius}, onTheSheet, onTheSlab])}/>
          <circle className="drawn-filled" cx={onTheSheet.x} cy={onTheSheet.y} r={0.9 * unitsPerStep}/>
        </Fragment>;
      })}
      {events.map(({word, call, spark}) => {
        const at = projected(spark, elevations.behavior);
        return <Call key={word} words={call} place={{x: at.x, y: at.y + sparkRadius * 4.6}}/>;
      })}
      {languages.map(({word, elevation}) => {
        const {x, y} = projected({u: 0, v: plate.down / 2}, elevation);
        return <text key={word} className="drawn-caption uppercase ink-filled paper-haloed" x={x - 6 * unitsPerStep}
          y={y + 2 * unitsPerStep} textAnchor="end">{word}</text>;
      })}
    </svg>
    <figcaption className="caption"><strong className="bold">A page, pulled apart.</strong> The markup is the slab. The
      sheet makes the regions and names them. The script touches two points, and each wire finds the element its event
      fires on. Lift the sheet or the script off and the page still stands: that is separate. Set them back and every
      mark lands on its element: that is together.
    </figcaption>
  </figure>;
