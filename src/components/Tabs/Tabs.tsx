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
  defaultTab?: string;
  values: Tab[];
  label: string;
  id?: string;
};

export const Tabs: FC<Props> = ({values, id, label, defaultTab}) => {
  const {pathname} = useLocation();
  const {tab, createSearchParams} = useSearchParamsObject({tab: schema.string});
  const current = tab ?? defaultTab;

  return <nav aria-label={label} id={id} className="tabs backdrop">{values.map(({param, display}) =>
    <span className="tab field attentive" key={param}>
      <Link to={`${pathname}${createSearchParams({tab: param})}`}
        aria-current={current === param ? 'page' : undefined}
        className="path">{display}</Link>
    </span>
  )}</nav>;
};
