import {FC} from 'react';

export const TurnHead: FC<{markerWidth: number}> = ({markerWidth}) =>
  <defs>
    <marker id="page-turn-head" viewBox="0 0 6 6" refX="3" refY="3"
      markerWidth={markerWidth} markerHeight={markerWidth} orient="auto-start-reverse">
      <path className="markup-attribute-filled" d="M 0 0 L 6 3 L 0 6 z"/>
    </marker>
  </defs>;
