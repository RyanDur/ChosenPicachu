import {FC, PropsWithChildren} from 'react';
import {classNames} from '@components';

type QuoteProps = PropsWithChildren<{voice: 'paragraph' | 'sub-title'}>;

export const Quote: FC<QuoteProps> = ({voice, children}) =>
  <blockquote>
    <p className={classNames('quote', voice, 'italic', 'trim-bar-beside')}>{children}</p>
  </blockquote>;
