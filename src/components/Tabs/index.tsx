import {FC} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {toQueryString} from '../../util/URL';
import {join} from '../util';
import {useQuery} from '../hooks';
import './Tabs.scss';

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
    const {tab, ...rest} = useQuery<{ tab: string }>();

    return <nav id={id} className="tabs">{values.map(({param, display}) =>
        <h3 className={join('tab', tab === param && 'current')} key={param}>
            <Link to={`${pathname}${toQueryString({tab: param, ...rest, page: 1})}`}
                  className="path">{display}</Link>
        </h3>
    )}</nav>;
};