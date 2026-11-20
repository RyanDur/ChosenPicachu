import {FC} from 'react';
import {classNames, PropsWithClassName} from '@components';
import {plateFrame} from './plateFrame';

export const Frame: FC<PropsWithClassName> = ({className}) =>
  <rect className={classNames('paper-filled', className)} {...plateFrame}/>;
