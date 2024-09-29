import {FC, useEffect} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {join} from '../util';
import {useQuery} from '../hooks';
import './Tabs.css';
import {not} from "@ryandur/sand";

interface Tab {
  display: string;
  param: string;
}

interface Props {
  values: Tab[];
  id?: string;
  role?: string;
}

export const Tabs: FC<Props> = ({values, id, role}) => {
  const {pathname} = useLocation();
  const {queryObj: {tab}, nextQueryString, updateQueryString} = useQuery<{ tab: string }>();

  useEffect(() => {
    if (not(tab)) updateQueryString({tab: values[0].param});
  }, [tab, updateQueryString, values]);

  return <nav role={role} id={id} className="tabs">{values.map(({param, display}) =>
    <h3 className={join('tab', tab === param && 'current')} key={param}>
      <Link to={`${pathname}${nextQueryString({tab: param})}`}
            className="path">{display}</Link>
    </h3>
  )}</nav>;
};
