import {FC, PropsWithChildren, ReactNode} from 'react';
import {classNames} from '@components/class-names';
import './Quotation.css';

type QuotationProps = Required<PropsWithChildren<{
  voice: 'paragraph' | 'sub-title';
  source: ReactNode;
}>>;

export const Quotation: FC<QuotationProps> = ({voice, source, children}) =>
  <figure className="quotation">
    <blockquote>
      <p className={classNames('quote', voice, 'italic', 'trim-bar-beside')}>{children}</p>
    </blockquote>
    <figcaption className="attribution caption">{source}</figcaption>
  </figure>;
