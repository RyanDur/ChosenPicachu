import {createContext, FC, PropsWithChildren, ReactNode, useContext} from 'react';
import {Maybe, nothing} from '@ryandur/sand';
import {MomentHeading, monthOf} from './moments';

type InTheYear = {readonly doors: string; readonly date: string};

const aYearOfItsOwn: Maybe<InTheYear> = nothing();

export const DoorsInTheYear = createContext<Maybe<InTheYear>>(aYearOfItsOwn);

export const Moment: FC<PropsWithChildren<{of: MomentHeading; tells: ReactNode}>> = ({of: {year, title, id}, tells, children}) =>
  useContext(DoorsInTheYear).either(
    ({doors, date}) => <li className="moment trim-rail-along" id={id} tabIndex={-1}>
      <time dateTime={date} className="month caption bold">{monthOf(date)}</time>
      <hgroup className="beat-heading">
        <h4 className="beat-title sub-title void-dot-before">{title}</h4>
        <p className="doors caption">{doors}</p>
      </hgroup>
      <p className="beat-tells paragraph muted-ink hyphenated">{tells}</p>
      {children}
    </li>,
    () => <li className="moment trim-rail-along" id={id} tabIndex={-1}>
      <time dateTime={year} className="year caption bold">{year}</time>
      <h3 className="beat-title sub-title void-dot-before">{title}</h3>
      <p className="beat-tells paragraph muted-ink hyphenated">{tells}</p>
      <details className="fuller-story" name="record">
        <summary className="prompt caption">the fuller story</summary>
        {children}
      </details>
    </li>);
