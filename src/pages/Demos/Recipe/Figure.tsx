import {FC, PropsWithChildren, ReactNode} from 'react';
import './RecipeFigure.css';
import {classNames} from '@components/class-names';

type Props = PropsWithChildren<{viewBox: string; title: string; says: ReactNode; className?: string}>;

export const Figure: FC<Props> = ({viewBox, title, says, className, children}) =>
  <figure className={classNames('recipe-figure', className)}>
    <svg className="recipe-drawing center" viewBox={viewBox} aria-hidden="true">{children}</svg>
    <figcaption className="caption"><strong className="bold">{title}.</strong> {says}</figcaption>
  </figure>;
