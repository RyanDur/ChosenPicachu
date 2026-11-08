import {FC, PropsWithChildren, ReactNode, useContext} from 'react';
import {MomentHeading, moments} from './moments';
import {ConcernsInTheYear} from './concernsInTheYear';

export const Moment: FC<PropsWithChildren<{heading: MomentHeading; summary: ReactNode}>> = ({
  heading: {date, title, id}, summary, children
}) => {
  const concernsInTheYear = useContext(ConcernsInTheYear);
  return date.kind === 'year'
    ? <li className="moment trim-rail-along" id={id} tabIndex={-1}>
      <time dateTime={date.year} className="year caption bold">{date.year}</time>
      <h3 className="moment-title sub-title void-dot-before">{title}</h3>
      <p className="moment-summary paragraph muted-ink hyphenated">{summary}</p>
      <details className="fuller-story" name="record">
        <summary className="prompt caption">the fuller story</summary>
        {children}
      </details>
    </li>
    : <li className="moment trim-rail-along" id={id} tabIndex={-1}>
      <time dateTime={moments.isoDateOf(date)} className="month caption bold">{moments.monthOf(date)}</time>
      <hgroup className="moment-heading">
        <h4 className="moment-title sub-title void-dot-before">{title}</h4>
        {concernsInTheYear.either(concerns => <p className="concerns caption">{concerns}</p>, () => null)}
      </hgroup>
      <p className="moment-summary paragraph muted-ink hyphenated">{summary}</p>
      {children}
    </li>;
};
