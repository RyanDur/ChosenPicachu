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
  tabs: Tab[];
  label: string;
  id?: string;
}>>;

export const Tabs: FC<Props> = ({tabs, id, label, current, className, children}) =>
  <nav aria-label={label} id={id} className={classNames('tabs backdrop backdrop-above contained swipe-scrolled', className)}>
    <ul className="tab-list">{tabs.map(({param, display, to}) =>
      <li className="tab tab-path bold field attentive backdrop-underlined" key={param}>
        <Link to={to} preventScrollReset
          aria-current={current === param ? 'page' : undefined}
          className="path">{display}</Link>
      </li>
    )}</ul>
    {children}
  </nav>;
