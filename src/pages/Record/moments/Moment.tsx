import {FC, PropsWithChildren, useContext} from 'react';
import {MomentHeading, moments} from '../calendar';
import {ConcernsInTheYear} from './concernsInTheYear';

export const Moment: FC<PropsWithChildren<{heading: MomentHeading}>> = ({heading: {date, title, id}, children}) => {
  const concernsInTheYear = useContext(ConcernsInTheYear);
  return date.kind === 'year'
    ? <li className="moment trim-rail-along" id={id} tabIndex={-1}>
      <time dateTime={date.year} className="year caption bold">{date.year}</time>
      <h3 className="moment-title sub-title void-dot-before">{title}</h3>
      {children}
    </li>
    : <li className="moment trim-rail-along" id={id} tabIndex={-1}>
      <time dateTime={moments.isoDateOf(date)} className="month caption bold">{moments.monthOf(date)}</time>
      <hgroup className="moment-heading">
        <h4 className="moment-title sub-title void-dot-before">{title}</h4>
        {concernsInTheYear.either(concerns => <p className="concerns caption">{concerns}</p>, () => null)}
      </hgroup>
      {children}
    </li>;
};
