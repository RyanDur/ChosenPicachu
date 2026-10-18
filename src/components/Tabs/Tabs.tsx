import {FC} from 'react';
import {Link, useLocation} from 'react-router';
import {useSearchParamsObject} from '@components/search-params';
import './Tabs.css';

type Tab = {
  display: string;
  param: string;
};

type Props = {
  current?: string;
  values: Tab[];
  label: string;
  id?: string;
};

export const Tabs: FC<Props> = ({values, id, label, current}) => {
  const {pathname} = useLocation();
  const {createSearchParams} = useSearchParamsObject({});

  return <nav aria-label={label} id={id} className="tabs backdrop backdrop-above contained">
    <ul className="tab-list">{values.map(({param, display}) =>
      <li className="tab tab-path bold field attentive backdrop-underlined" key={param}>
        <Link to={`${pathname}${createSearchParams({tab: param})}`}
          aria-current={current === param ? 'page' : undefined}
          className="path">{display}</Link>
      </li>
    )}</ul>
  </nav>;
};
