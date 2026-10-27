import {FC} from 'react';
import {Link} from 'react-router';
import {placeKept} from '@components/scroll';
import './Tabs.css';

type Tab = {
  display: string;
  param: string;
  to: string;
};

type Props = {
  current?: string;
  values: Tab[];
  label: string;
  id?: string;
};

export const Tabs: FC<Props> = ({values, id, label, current}) =>
  <nav aria-label={label} id={id} className="tabs backdrop backdrop-above contained">
    <ul className="tab-list">{values.map(({param, display, to}) =>
      <li className="tab tab-path bold field attentive backdrop-underlined" key={param}>
        <Link to={to} state={placeKept}
          aria-current={current === param ? 'page' : undefined}
          className="path">{display}</Link>
      </li>
    )}</ul>
  </nav>;
