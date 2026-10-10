import {FC, PropsWithChildren, ReactNode} from 'react';

export const Moment: FC<PropsWithChildren<{year: string; title: string; tells: ReactNode}>> = ({year, title, tells, children}) =>
  <li className="moment trim-rail-along">
    <time dateTime={year} className="year caption bold">{year}</time>
    <h3 className="beat-title sub-title void-dot-before">{title}</h3>
    <p className="beat-tells paragraph muted-ink hyphenated">{tells}</p>
    <details className="fuller-story" name="record">
      <summary className="prompt caption">the fuller story</summary>
      {children}
    </details>
  </li>;
