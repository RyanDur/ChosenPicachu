import {FC, PropsWithChildren} from 'react';
import {classNames, PropsWithClassName} from '@components';
import {edgeBox} from './edgeBox';
import './Plate.css';

export const Plate: FC<PropsWithChildren<PropsWithClassName>> = ({className, children}) =>
  <svg className={classNames('page-plate', className)}
    viewBox={`${edgeBox.x} ${edgeBox.y} ${edgeBox.width} ${edgeBox.height}`} aria-hidden="true">
    {children}
  </svg>;
