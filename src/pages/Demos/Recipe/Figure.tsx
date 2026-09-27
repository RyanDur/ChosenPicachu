import {FC, PropsWithChildren, ReactNode} from 'react';
import './RecipeFigure.css';

type Props = PropsWithChildren<{viewBox: string; caption: ReactNode}>;

export const Figure: FC<Props> = ({viewBox, caption, children}) =>
  <figure className="recipe-figure">
    <svg viewBox={viewBox} aria-hidden="true">{children}</svg>
    <figcaption className="caption">{caption}</figcaption>
  </figure>;
