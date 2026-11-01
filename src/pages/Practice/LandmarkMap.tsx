import {FC} from 'react';
import {has} from '@ryandur/sand';
import './LandmarkMap.css';

type Box = {
  readonly label: string;
  readonly look: string;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly note?: string;
};

const labelSize = 7;
const noteSize = 6;
const inset = 6;

const landmark = 'paper-filled drawn';
const rail = 'faded-mint-filled drawn';
const notALandmark = 'paper-filled drawn thin-drawn';
const topLayer = 'paper-filled drawn dashed-drawn';

const wide: Box[] = [
  {label: 'header', look: landmark, x: 4, y: 4, width: 312, height: 28},
  {label: 'section · pages and feedback', look: rail, x: 4, y: 38, width: 120, height: 150},
  {label: 'nav · site', look: landmark, x: 12, y: 56, width: 104, height: 80},
  {label: 'feedback', look: notALandmark, x: 12, y: 144, width: 104, height: 36},
  {label: 'main', look: landmark, x: 130, y: 38, width: 186, height: 150},
  {label: 'nav · tabs', look: notALandmark, x: 138, y: 64, width: 170, height: 20, note: 'only where a page has tabs'},
  {label: 'footer', look: landmark, x: 4, y: 194, width: 312, height: 26},
  {label: 'section · role alert · top layer', look: topLayer, x: 180, y: 28, width: 132, height: 20}
];

const stacked: Box[] = [
  {label: 'header', look: landmark, x: 4, y: 4, width: 192, height: 28},
  {label: 'section · pages and feedback', look: rail, x: 4, y: 38, width: 192, height: 54},
  {label: 'nav · site', look: landmark, x: 10, y: 60, width: 120, height: 26},
  {label: 'feedback', look: notALandmark, x: 136, y: 60, width: 54, height: 26},
  {label: 'main', look: landmark, x: 4, y: 98, width: 192, height: 110},
  {label: 'nav · tabs', look: notALandmark, x: 10, y: 124, width: 180, height: 20, note: 'only where a page has tabs'},
  {label: 'footer', look: landmark, x: 4, y: 214, width: 192, height: 26},
  {label: 'section · role alert · top layer', look: topLayer, x: 60, y: 88, width: 132, height: 20}
];

const DrawnBox: FC<{box: Box}> = ({box: {label, look, x, y, width, height, note}}) => <>
  <rect className={look} x={x} y={y} width={width} height={height}/>
  <text x={x + inset} y={y + inset + labelSize} fontSize={labelSize}>{label}</text>
  {has(note) && <text x={x} y={y + height + inset + noteSize} fontSize={noteSize}>{note}</text>}
</>;

const Frame: FC<{boxes: Box[]; className: string; viewBox: string}> = ({boxes, className, viewBox}) =>
  <svg className={`${className} ink-filled`} viewBox={viewBox} aria-hidden="true">
    {boxes.map(box => <DrawnBox key={box.label} box={box}/>)}
  </svg>;

export const LandmarkMap: FC = () =>
  <figure className="landmark-map">
    <Frame boxes={wide} className="landmark-map-wide" viewBox="0 0 320 224"/>
    <Frame boxes={stacked} className="landmark-map-stacked center" viewBox="0 0 200 244"/>
    <figcaption className="caption"><strong className="bold">The page’s table of contents.</strong> Every landmark named;
      a screen reader lists them and jumps to any.
    </figcaption>
  </figure>;
