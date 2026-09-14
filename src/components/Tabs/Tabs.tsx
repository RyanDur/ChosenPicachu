import {FC, useEffect} from 'react';
import {Link, useLocation} from 'react-router';
import {useSearchParamsObject} from '@components/search-params';
import * as schema from 'schemawax';
import {has, not} from '@ryandur/sand';
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
  const {tab, updateSearchParams, createSearchParams} = useSearchParamsObject({tab: schema.string});

  useEffect(() => {
    if (not(tab) && has(defaultTab)) updateSearchParams({tab: defaultTab}, {replace: true});
  }, [tab, updateSearchParams, values, defaultTab]);

  return <nav aria-label={label} id={id} className="backdrop tabs">{values.map(({param, display}) =>
    <span className="field tab attentive" key={param}>
      <Link to={`${pathname}${createSearchParams({tab: param})}`}
        aria-current={tab === param ? 'page' : undefined}
        className="path">{display}</Link>
    </span>
  )}</nav>;
};
