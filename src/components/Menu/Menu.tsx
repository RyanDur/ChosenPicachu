import {ComponentProps, FC} from 'react';
import {Link} from 'react-router';
import {classNames} from '@components/class-names';
import './Menu.css';

const itemLooks = ['unfilled', 'borderless', 'muted-rule-below', 'shadow-ringed', 'soft-press-glowing'] as const;

export const Menu: FC<ComponentProps<'menu'>> = ({className, ...menu}) =>
  <menu {...menu} className={classNames('menu', className)}/>;

export const Entry: FC<ComponentProps<'li'>> = ({className, ...li}) =>
  <li {...li} className={classNames('entry', className)}/>;

export const Item: FC<ComponentProps<'button'>> = ({className, ...button}) =>
  <button {...button} type="button" className={classNames('item', className, ...itemLooks)}/>;

export const ItemLink: FC<ComponentProps<typeof Link>> = ({className, ...link}) =>
  <Link {...link} className={classNames('item', className, ...itemLooks)}/>;
