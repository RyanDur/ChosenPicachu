import {FC, PropsWithChildren} from 'react';
import {Link} from 'react-router';
import {classNames, PropsWithClassName} from '@components';
import './Tabs.css';

type Tab = {
  display: string;
  param: string;
  to: string;
};

type Props = PropsWithChildren<PropsWithClassName<{
  current?: string;
  'aria-current'?: 'page' | 'true';
  tabs: Tab[];
  label: string;
  id?: string;
}>>;

export const Tabs: FC<Props> = ({tabs, id, label, current, 'aria-current': ariaCurrent = 'page', className, children}) =>
  <nav aria-label={label} id={id} className={classNames('tabs backdrop backdrop-above contained swipe-scrolled', className)}>
    <ul className="tab-list">{tabs.map(({param, display, to}) =>
      <li className="tab tab-path bold field attentive backdrop-underlined" key={param}>
        <Link to={to} preventScrollReset
          aria-current={current === param ? ariaCurrent : undefined}
          className="path">{display}</Link>
      </li>
    )}</ul>
    {children}
  </nav>;
