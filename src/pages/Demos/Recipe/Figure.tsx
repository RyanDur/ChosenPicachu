import {FC, PropsWithChildren, ReactNode} from 'react';
import './RecipeFigure.css';
import {classNames} from '@components/class-names';

type Props = PropsWithChildren<{viewBox: string; caption: ReactNode; className?: string}>;

export const Figure: FC<Props> = ({viewBox, caption, className, children}) =>
  <figure className={classNames('recipe-figure', className)}>
    <svg className="recipe-drawing center" viewBox={viewBox} aria-hidden="true">{children}</svg>
    <figcaption className="caption">{caption}</figcaption>
  </figure>;
