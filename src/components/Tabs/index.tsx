import {FC} from 'react';
import {Link, useRouteMatch} from 'react-router-dom';
import {toQueryString} from '../../util/URL';

interface Tab {
    display: string;
    param: string;
}

interface Props {
    values: Tab[];
}

export const Tabs: FC<Props> = ({values}) => {
    const {path} = useRouteMatch();

    return <nav>{values.map(({param, display}) =>
        <Link to={`${path}${toQueryString({tab: param})}`} key={param}>{display}</Link>
    )}</nav>;
};