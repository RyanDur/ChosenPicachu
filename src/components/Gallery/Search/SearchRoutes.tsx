import {Route, Switch, useRouteMatch} from 'react-router-dom';
import {Search} from './index';
import React, {FC} from 'react';
import {GalleryPath} from '../index';

export const SearchRoutes: FC = () => {
    const {path} = useRouteMatch();
    return <Switch>
        <Route path={path} exact><Search id="gallery-search"/></Route>
        <Route path={`${path}${GalleryPath.piece}`} exact><Search id="gallery-search"/></Route>
    </Switch>;
};