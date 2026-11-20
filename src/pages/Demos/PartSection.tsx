import {FC, PropsWithChildren, ReactNode, useId} from 'react';
import {is, not} from '@ryandur/sand';
import {classNames} from '@components';
import './PartPage.css';

type Opening = {
  readonly caption: ReactNode;
  readonly introduction?: ReactNode;
};

type BodyFirst = {
  readonly caption?: never;
  readonly introduction?: never;
};

type PartSectionProps = {
  readonly title: string;
  readonly panel: ReactNode;
  readonly foot: ReactNode;
  readonly wears?: string;
} & (Opening | BodyFirst);

export const PartSection: FC<PropsWithChildren<PartSectionProps>> = (
  {title, caption, introduction, panel, foot, wears, children}
) => {
  const titled = `part${useId()}`;
  return <section aria-labelledby={titled} className={classNames('part-page', not(caption) && 'body-first')}>
    {is(caption)
      ? <header className="part-opening">
        <hgroup>
          <p className="caption">{caption}</p>
          <h2 id={titled} className="title">{title}</h2>
        </hgroup>
        {introduction}
      </header>
      : <h2 id={titled} className="off-screen">{title}</h2>}
    {panel}
    <section className={classNames('part-body', wears)}>{children}</section>
    {foot}
  </section>;
};
