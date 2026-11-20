import {FC} from 'react';
import {classNames, PropsWithClassName} from '@components';
import {edgeBox} from './edgeBox';

export const Edge: FC<PropsWithClassName> = ({className}) =>
  <rect className={classNames('paper-filled', className)} {...edgeBox}/>;
