import {FC, PropsWithChildren, ReactNode, useId} from 'react';
import {maybe} from '@ryandur/sand';
import {classNames} from '@components';
import {BesideAPart} from './beside-a-part';
import './PartPage.css';

type Opening = {
  readonly place: string;
  readonly introduction?: ReactNode;
};

type BodyFirst = {
  readonly place?: never;
  readonly introduction?: never;
};

type PartSectionProps = {
  readonly heading: string;
  readonly panel: ReactNode;
  readonly foot: ReactNode;
  readonly wears?: string;
} & (Opening | BodyFirst);

export const PartSection: FC<PropsWithChildren<PartSectionProps>> = (
  {heading, place, introduction, panel, foot, wears, children}
) => {
  const headed = `part${useId()}`;
  const placed = maybe(place);
  const bodyFirst = placed.either(() => false, () => true);
  return <section aria-labelledby={headed} className={classNames('part-page', bodyFirst && 'body-first')}>
    {placed.either(shown => <header className="part-opening">
      <hgroup>
        <p className="caption uppercase">{shown}</p>
        <h2 id={headed} className="title">{heading}</h2>
      </hgroup>
      {introduction}
    </header>, () => <h2 id={headed} className="off-screen">{heading}</h2>)}
    <BesideAPart value>{panel}</BesideAPart>
    <section className={classNames('part-body', wears)}>{children}</section>
    {foot}
  </section>;
};
