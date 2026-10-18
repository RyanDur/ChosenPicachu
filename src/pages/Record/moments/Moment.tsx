import {createContext, FC, PropsWithChildren, ReactNode, useContext} from 'react';
import {Maybe, nothing} from '@ryandur/sand';
import {MomentHeading, monthOf, writtenAs} from './moments';

const noDoors: Maybe<string> = nothing();

export const DoorsInTheYear = createContext<Maybe<string>>(noDoors);

export const Moment: FC<PropsWithChildren<{of: MomentHeading; tells: ReactNode}>> = ({of: {date, title, id}, tells, children}) => {
  const doors = useContext(DoorsInTheYear);
  return date.kind === 'year'
    ? <li className="moment trim-rail-along" id={id} tabIndex={-1}>
      <time dateTime={date.year} className="year caption bold">{date.year}</time>
      <h3 className="beat-title sub-title void-dot-before">{title}</h3>
      <p className="beat-tells paragraph muted-ink hyphenated">{tells}</p>
      <details className="fuller-story" name="record">
        <summary className="prompt caption">the fuller story</summary>
        {children}
      </details>
    </li>
    : <li className="moment trim-rail-along" id={id} tabIndex={-1}>
      <time dateTime={writtenAs(date)} className="month caption bold">{monthOf(date)}</time>
      <hgroup className="beat-heading">
        <h4 className="beat-title sub-title void-dot-before">{title}</h4>
        {doors.either(told => <p className="doors caption">{told}</p>, () => null)}
      </hgroup>
      <p className="beat-tells paragraph muted-ink hyphenated">{tells}</p>
      {children}
    </li>;
};
