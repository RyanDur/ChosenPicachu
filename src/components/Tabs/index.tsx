import {FC} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {join} from '../util';
import {useQuery} from '../hooks';
import './Tabs.css';

interface Tab {
    display: string;
    param: string;
}

interface Props {
    values: Tab[];
    id?: string;
}

export const Tabs: FC<Props> = ({values, id}) => {
    const {pathname} = useLocation();
    const {queryObj: {tab}, nextQueryString} = useQuery<{ tab: string, page: number }>();

    return <nav id={id} className="tabs">{values.map(({param, display}) =>
        <h3 className={join('tab', tab === param && 'current')} key={param}>
            <Link to={`${pathname}${nextQueryString({tab: param, page: 1})}`}
                  className="path">{display}</Link>
        </h3>
    )}</nav>;
};
