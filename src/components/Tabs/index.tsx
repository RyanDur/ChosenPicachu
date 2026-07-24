import {FC, useEffect} from 'react';
import {Link, useLocation} from 'react-router';
import {join} from '@components/class-names';
import {useSearchParamsObject} from '@components/search-params';
import * as D from 'schemawax';
import {not} from '@ryandur/sand';
import './Tabs.css';

type Tab = {
  display: string;
  param: string;
}

type Props = {
  defaultTab: string;
  values: Tab[];
  label: string;
  id?: string;
}

export const Tabs: FC<Props> = ({values, id, label, defaultTab}) => {
  const {pathname} = useLocation();
  const {tab, updateSearchParams, createSearchParams} = useSearchParamsObject({tab: D.string});

  useEffect(() => {
    if (not(tab)) updateSearchParams({tab: defaultTab});
  }, [tab, updateSearchParams, values, defaultTab]);

  return <nav aria-label={label} id={id} className="tabs">{values.map(({param, display}) =>
    <span className={join('tab', tab === param && 'current')} key={param}>
      <Link to={`${pathname}${createSearchParams({tab: param})}`}
            className="path">{display}</Link>
    </span>
  )}</nav>;
};
