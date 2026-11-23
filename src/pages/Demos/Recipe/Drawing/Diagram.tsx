import {FC, PropsWithChildren} from 'react';
import '../RecipeFigure.css';
import '../../Drawing.css';

export const Diagram: FC<PropsWithChildren<{lead: string; says: string; height: number}>> =
  ({lead, says, height, children}) =>
    <figure className="recipe-figure diagram">
      <svg className="recipe-drawing center ink-filled" viewBox={`0 0 320 ${height}`} aria-hidden="true">{children}</svg>
      <figcaption className="caption"><strong className="bold">{lead}.</strong> {says}</figcaption>
    </figure>;
