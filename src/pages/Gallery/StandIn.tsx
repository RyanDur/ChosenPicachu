import {ComponentProps, FC} from 'react';
import {classNames} from '@components/class-names';
import './StandIn.css';

export const StandIn: FC<ComponentProps<'img'> & {alt: string}> = ({alt, className, ...img}) =>
  <img {...img} alt={alt} className={classNames('stand-in', className)}/>;
