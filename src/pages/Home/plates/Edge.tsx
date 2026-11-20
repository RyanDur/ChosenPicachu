import {FC} from 'react';
import {classNames, PropsWithClassName} from '@components';
import {edgeBox} from './edgeBox';

export const Edge: FC<PropsWithClassName> = ({className}) =>
  <rect className={classNames('paper-filled', className)} x={edgeBox.x} y={edgeBox.y}
    width={edgeBox.width} height={edgeBox.height}/>;
