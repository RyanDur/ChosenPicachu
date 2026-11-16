import {FC, PropsWithChildren, ReactNode} from 'react';
import './RecipeFigure.css';
import {classNames, PropsWithClassName} from '@components';

type Props = PropsWithChildren<PropsWithClassName<{viewBox: string; title: string; says: ReactNode}>>;

export const Figure: FC<Props> = ({viewBox, title, says, className, children}) =>
  <figure className={classNames('recipe-figure', className)}>
    <svg className="recipe-drawing center ink-filled" viewBox={viewBox} aria-hidden="true">{children}</svg>
    <figcaption className="caption"><strong className="bold">{title}.</strong> {says}</figcaption>
  </figure>;
