import {FC, PropsWithChildren} from 'react';
import {YearHeading} from '../calendar';

export const YearMoment: FC<PropsWithChildren<{heading: YearHeading}>> = ({heading: {date, title, id}, children}) =>
  <li className="moment trim-rail-along" id={id} tabIndex={-1}>
    <time dateTime={date.year} className="year caption bold">{date.year}</time>
    <h3 className="moment-title sub-title void-dot-before">{title}</h3>
    {children}
  </li>;
