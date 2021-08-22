import {Route, Switch, useRouteMatch} from 'react-router-dom';
import {Search} from './index';
import React, {FC} from 'react';
import {GalleryPath} from '../index';
import {useQuery} from '../../hooks';
import {Source} from '../../../data/types';

export const SearchRoutes: FC = () => {
    const {path} = useRouteMatch();
    const {tab} = useQuery<{tab: string}>();
    return <>{tab === Source.AIC && <Switch>
        <Route path={path} exact><Search id="gallery-search"/></Route>
        <Route path={`${path}${GalleryPath.piece}`} exact><Search id="gallery-search"/></Route>
    </Switch>}</>;
};