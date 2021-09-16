import React from 'react';
import {Link, Redirect, Route, Switch, useRouteMatch} from 'react-router-dom';
import {About, Gallery, GalleryNav, GalleryTitle, Home, PageControl, SearchRoutes, Users} from './components';
import {toQueryString} from './util/URL';
import {Source} from './data/artGallery/types';
import {defaultRecordLimit} from './config';
import './App.layout.scss';
import {Card, Grid} from '@material-ui/core';

export enum Paths {
    home = '/',
    about = '/about',
    users = '/users',
    artGallery = '/gallery',
    repo = 'https://github.com/RyanDur/ChosenPicachu',
}

export const App = () => {
    return <>
        <Card component="header" id="app-header" data-testid="header">
            <h1 className="title ellipsis">
                <Switch>
                    <Route path={Paths.home} exact>Home</Route>
                    <Route path={Paths.about} exact>About</Route>
                    <Route path={Paths.users} exact>Users</Route>
                    <Route path={Paths.artGallery}><GalleryTitle/></Route>
                </Switch>
            </h1>

            <Switch>
                <Route path={Paths.artGallery}><SearchRoutes/></Route>
            </Switch>
        </Card>
        <Card component="aside" id="side-nav" data-testid="navigation">
            <nav id="app-navigation">
                <Link id="navigate-home" className="path" to={Paths.home}>Home</Link>
                <Link id="navigate-about" className="path" to={Paths.about}>About</Link>
                <Link id="navigate-users" className="path" to={Paths.users}>Users</Link>
                <Link id="navigate-form" className="path"
                      to={`${Paths.artGallery}${toQueryString({
                          page: 1,
                          size: defaultRecordLimit,
                          tab: Source.AIC
                      })}`}>Gallery</Link>
                <a id="navigate-repo" className="path" href={Paths.repo}
                      rel="noopener noreferrer" target="_blank">Repo</a>
            </nav>

            <Grid container component="article" className="icons borrowed-assets" tabIndex={0}>
                <Grid item component="h2" className="icons-title">ICONS</Grid>
                <Grid item container component="nav" className="icons-content">
                    <Grid item component="a" xs={12} href="https://icons8.com/icon/622/detective"
                          rel="noopener noreferrer" target="_blank"
                          className="attribution">Detective icon by Icons8</Grid>
                    <Grid item component="a" xs={12} href="https://icons8.com/icon/j1UxMbqzPi7n/no-image"
                          rel="noopener noreferrer" target="_blank"
                          className="attribution">No Image icon by
                        Icons8</Grid>
                    <Grid item component="a" xs={12} href="https://icons8.com/icon/EJK2FdL08858/no-image-gallery"
                          rel="noopener noreferrer"
                          target="_blank" className="attribution">No Image
                        Gallery icon by Icons8</Grid>
                    <Grid item component="a" xs={12} href="https://icons8.com/icon/86209/reset"
                          rel="noopener noreferrer" target="_blank"
                          className="attribution">Reset icon by Icons8</Grid>
                    <Grid item component="a" xs={12} href="https://icons8.com/icon/59878/search"
                          rel="noopener noreferrer" target="_blank"
                          className="attribution">Search icon by Icons8</Grid>
                </Grid>
            </Grid>
        </Card>
        <Card component="main" data-testid="main" className={useRouteMatch(Paths.artGallery) ? 'gallery-in-view' : ''}>
            <Switch>
                <Route path={Paths.home} exact><Home/></Route>
                <Route path={Paths.about} exact><About/></Route>
                <Route path={Paths.users} exact><Users/></Route>
                <Route path={Paths.artGallery}><Gallery/></Route>
                <Route path="*"><Redirect to={Paths.home}/></Route>
            </Switch>
        </Card>
        <Switch><Route path={Paths.artGallery} exact>
            <Card component="aside" id="filter" data-testid="filter">
                <PageControl/>
            </Card>
            <Card component="footer" id={'app-footer'} className={'stick-to-bottom'} data-testid="footer">
                <GalleryNav id="gallery-nav"/>
            </Card>
        </Route></Switch>
    </>;
};
