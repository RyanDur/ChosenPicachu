import {FC} from 'react';
import {Link} from 'react-router';
import {classNames, PropsWithClassName} from '@components';
import './Tabs.css';

type Tab = {
  display: string;
  param: string;
  to: string;
};

type Props = PropsWithClassName<{
  current?: string;
  values: Tab[];
  label: string;
  id?: string;
}>;

export const Tabs: FC<Props> = ({values, id, label, current, className}) =>
  <nav aria-label={label} id={id} className={classNames('tabs backdrop backdrop-above contained swipe-scrolled', className)}>
    <ul className="tab-list">{values.map(({param, display, to}) =>
      <li className="tab tab-path bold field attentive backdrop-underlined" key={param}>
        <Link to={to} preventScrollReset
          aria-current={current === param ? 'page' : undefined}
          className="path">{display}</Link>
      </li>
    )}</ul>
  </nav>;
