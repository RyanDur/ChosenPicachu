import {ComponentProps, FC} from 'react';
import {classNames} from '../classNames';
import './Menu.css';

export const Menu: FC<ComponentProps<'menu'>> = ({className, ...menu}) =>
  <menu {...menu} className={classNames('menu', className)}/>;
