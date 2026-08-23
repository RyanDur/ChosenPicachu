import {FC, PropsWithChildren, ReactNode} from 'react';

export const Moment: FC<PropsWithChildren<{year: string, title: string, tells: ReactNode}>> = ({year, title, tells, children}) =>
  <li className="moment">
    <span className="year caption">{year}</span>
    <h3 className="beat-title">{title}</h3>
    <p className="beat-tells paragraph">{tells}</p>
    <details className="fuller-story">
      <summary className="prompt">the fuller story</summary>
      {children}
    </details>
  </li>;
