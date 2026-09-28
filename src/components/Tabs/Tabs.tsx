import {FC} from 'react';
import {Link, useLocation} from 'react-router';
import {useSearchParamsObject} from '@components/search-params';
import * as schema from 'schemawax';
import './Tabs.css';

type Tab = {
  display: string;
  param: string;
};

type Props = {
  param?: string;
  defaultTab?: string;
  values: Tab[];
  label: string;
  id?: string;
};

export const Tabs: FC<Props> = ({values, id, label, param: key = 'tab', defaultTab}) => {
  const {pathname} = useLocation();
  const {[key]: chosen, createSearchParams} = useSearchParamsObject<Record<string, string>>({[key]: schema.string});
  const current = chosen ?? defaultTab;

  return <nav aria-label={label} id={id} className="tabs backdrop contained">
    <ul className="tab-list">{values.map(({param, display}) =>
      <li className="tab field attentive" key={param}>
        <Link to={`${pathname}${createSearchParams({[key]: param})}`}
          aria-current={current === param ? 'page' : undefined}
          className="path">{display}</Link>
      </li>
    )}</ul>
  </nav>;
};
