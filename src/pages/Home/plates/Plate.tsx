import {FC, PropsWithChildren} from 'react';
import {classNames, PropsWithClassName} from '@components';
import {plateFrame} from './plateFrame';
import './Plate.css';

const {x, y, width, height} = plateFrame;

export const Plate: FC<PropsWithChildren<PropsWithClassName>> = ({className, children}) =>
  <svg className={classNames('page-plate', className)} viewBox={`${x} ${y} ${width} ${height}`} aria-hidden="true">
    {children}
  </svg>;
