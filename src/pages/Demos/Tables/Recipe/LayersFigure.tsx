import {FC} from 'react';

export const LayersFigure: FC = () =>
  <figure className="recipe-figure">
    <svg viewBox="0 0 480 170" aria-hidden="true">
      <rect className="plane" x="10" y="90" width="300" height="70" rx="6"/>
      <text className="label" x="160" y="130" textAnchor="middle">the live table</text>
      <rect className="plane" x="90" y="50" width="300" height="70" rx="6"/>
      <text className="label" x="240" y="90" textAnchor="middle">transition overlay — the neighbor glides here</text>
      <rect className="plane-top" x="170" y="10" width="300" height="70" rx="6"/>
      <text className="label" x="320" y="50" textAnchor="middle">the ghost — named into the overlay, on top</text>
    </svg>
    <figcaption className="caption">
      View-transition groups paint in the top layer, above even fixed-position elements.
      The ghost joins the overlay under its own name to stay above the glide.
    </figcaption>
  </figure>;
