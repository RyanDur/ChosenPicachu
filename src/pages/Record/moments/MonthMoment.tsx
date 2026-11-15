import {FC, PropsWithChildren, useContext} from 'react';
import {moments, MonthHeading} from '../calendar';
import {ConcernsInTheYear} from './concernsInTheYear';

export const MonthMoment: FC<PropsWithChildren<{heading: MonthHeading}>> = ({heading: {date, title, id}, children}) => {
  const concernsInTheYear = useContext(ConcernsInTheYear);
  return <li className="moment trim-rail-along" id={id} tabIndex={-1}>
    <time dateTime={moments.isoDateOf(date)} className="month caption bold">{moments.monthOf(date)}</time>
    <hgroup className="moment-heading">
      <h4 className="moment-title sub-title void-dot-before">{title}</h4>
      {concernsInTheYear.either(concerns => <p className="concerns caption">{concerns}</p>, () => null)}
    </hgroup>
    {children}
  </li>;
};
