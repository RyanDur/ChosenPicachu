import {FC, useEffect} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {join} from '../util';
import {useSearchParamsObject} from '../hooks';
import {not} from '@ryandur/sand';
import './Tabs.css';

interface Tab {
  display: string;
  param: string;
}

interface Props {
  defaultTab: string;
  values: Tab[];
  id?: string;
  role?: string;
}

export const Tabs: FC<Props> = ({values, id, role, defaultTab}) => {
  const {pathname} = useLocation();
  const {tab, updateSearchParams, createSearchParams} = useSearchParamsObject<{ tab: string }>();

  useEffect(() => {
    if (not(tab)) updateSearchParams({tab: defaultTab});
  }, [tab, updateSearchParams, values, defaultTab]);

  return <nav role={role} id={id} className="tabs">{values.map(({param, display}) =>
    <h3 className={join('tab', tab === param && 'current')} key={param}>
      <Link to={`${pathname}${createSearchParams({tab: param})}`}
            className="path">{display}</Link>
    </h3>
  )}</nav>;
};
