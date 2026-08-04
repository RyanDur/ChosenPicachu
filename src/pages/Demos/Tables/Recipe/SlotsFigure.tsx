import {FC} from 'react';

export const SlotsFigure: FC = () =>
  <figure className="recipe-figure">
    <svg viewBox="0 0 480 130" aria-hidden="true">
      <rect className="slot" x="10" y="20" width="130" height="70"/>
      <rect className="slot" x="140" y="20" width="90" height="70"/>
      <rect className="slot" x="230" y="20" width="120" height="70"/>
      <rect className="slot" x="350" y="20" width="120" height="70"/>
      <rect className="dead" x="230" y="20" width="30" height="70"/>
      <rect className="inner" x="260" y="20" width="60" height="70"/>
      <rect className="dead" x="320" y="20" width="30" height="70"/>
      <line className="center" x1="290" y1="14" x2="290" y2="96"/>
      <text className="label" x="290" y="110" textAnchor="middle">inner half switches</text>
      <text className="label" x="245" y="12" textAnchor="middle">dead</text>
      <text className="label" x="335" y="12" textAnchor="middle">dead</text>
    </svg>
    <figcaption className="caption">
      Pointer x walks cumulative slot widths across the chart. The outer quarter of a
      neighbor is a dead zone; only its inner half accepts the switch.
    </figcaption>
  </figure>;
