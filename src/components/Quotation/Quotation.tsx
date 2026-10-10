import {FC, ReactNode} from 'react';
import {classNames} from '@components/class-names';
import './Quotation.css';

type QuotationProps = {
  voice: 'paragraph' | 'sub-title';
  source: ReactNode;
  children: ReactNode;
};

export const Quotation: FC<QuotationProps> = ({voice, source, children}) =>
  <figure className="quotation">
    <blockquote>
      <p className={classNames('quote', voice, 'italic', 'trim-bar-beside')}>{children}</p>
    </blockquote>
    <figcaption className="attribution caption">{source}</figcaption>
  </figure>;
