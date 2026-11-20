import {FC, PropsWithChildren} from 'react';
import {classNames, PropsWithClassName} from '@components';

type Lettering = PropsWithChildren<PropsWithClassName<{
  x: number;
  y: number;
  fontSize: number;
  textLength: number;
  textAnchor: 'start' | 'middle' | 'end';
}>>;

export const Lettered: FC<Lettering> = ({children, className, ...placed}) =>
  <text className={classNames('monospaced', className)} {...placed} lengthAdjust="spacingAndGlyphs">{children}</text>;
