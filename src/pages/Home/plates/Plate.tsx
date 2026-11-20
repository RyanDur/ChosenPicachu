import {FC, PropsWithChildren} from 'react';
import {classNames, PropsWithClassName} from '@components';
import {edgeBox} from './edgeBox';
import './Plate.css';

const {x, y, width, height} = edgeBox;

export const Plate: FC<PropsWithChildren<PropsWithClassName>> = ({className, children}) =>
  <svg className={classNames('page-plate', className)} viewBox={`${x} ${y} ${width} ${height}`} aria-hidden="true">
    {children}
  </svg>;
