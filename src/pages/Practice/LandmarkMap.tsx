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

const inset = 9;

const landmark = 'landmark-box hollow drawn';
const secondary = 'secondary-box hollow drawn';
const topLayer = 'landmark-box paper-filled drawn dashed-drawn';

const wide: Box[] = [
  {label: 'header', look: landmark, x: 6, y: 6, width: 468, height: 42},
  {label: 'section · pages and feedback', look: landmark, x: 6, y: 57, width: 180, height: 225},
  {label: 'nav · site', look: landmark, x: 18, y: 84, width: 156, height: 120},
  {label: 'feedback', look: secondary, x: 18, y: 216, width: 156, height: 54},
  {label: 'main', look: landmark, x: 195, y: 57, width: 279, height: 225},
  {label: 'nav · tabs', look: secondary, x: 207, y: 96, width: 255, height: 30, note: 'only where a page has tabs'},
  {label: 'footer', look: landmark, x: 6, y: 291, width: 468, height: 39, note: 'only where a page has one'},
  {label: 'section · role alert · live region · top layer', look: topLayer, x: 186, y: 34, width: 282, height: 26}
];

const stacked: Box[] = [
  {label: 'header', look: landmark, x: 6, y: 6, width: 288, height: 42},
  {label: 'section · pages and feedback', look: landmark, x: 6, y: 57, width: 288, height: 81},
  {label: 'nav · site', look: landmark, x: 15, y: 90, width: 180, height: 39},
  {label: 'feedback', look: secondary, x: 204, y: 90, width: 81, height: 39},
  {label: 'main', look: landmark, x: 6, y: 147, width: 288, height: 165},
  {label: 'nav · tabs', look: secondary, x: 15, y: 186, width: 270, height: 30, note: 'only where a page has tabs'},
  {label: 'footer', look: landmark, x: 6, y: 321, width: 288, height: 39, note: 'only where a page has one'},
  {label: 'section · role alert · live region · top layer', look: topLayer, x: 12, y: 129, width: 282, height: 24}
];

const DrawnBox: FC<{box: Box}> = ({box: {label, look, x, y, width, height, note}}) => <>
  <rect className={look} x={x} y={y} width={width} height={height}/>
  <text className="drawn-caption" x={x + inset} y={y + inset} dominantBaseline="hanging">{label}</text>
  {has(note) && <text className="drawn-caption" x={x} y={y + height + inset} dominantBaseline="hanging">{note}</text>}
</>;

const Frame: FC<{boxes: Box[]; className: string; viewBox: string}> = ({boxes, className, viewBox}) =>
  <svg className={`${className} ink-filled`} viewBox={viewBox} aria-hidden="true">
    {boxes.map(box => <DrawnBox key={box.label} box={box}/>)}
  </svg>;

export const LandmarkMap: FC = () =>
  <figure className="landmark-map">
    <Frame boxes={wide} className="landmark-map-wide center" viewBox="0 0 480 356"/>
    <Frame boxes={stacked} className="landmark-map-stacked center" viewBox="0 0 300 388"/>
    <figcaption className="caption"><strong className="bold">The page’s table of contents.</strong> Each landmark, with its
      element and, where it has one, its name.
    </figcaption>
  </figure>;
