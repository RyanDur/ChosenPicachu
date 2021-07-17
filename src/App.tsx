import React from 'react';
import {Link, Route, Switch, useRouteMatch} from 'react-router-dom';
import {About, Users, Home, ArtGallery} from './components';
import './App.css';
import './App.layout.css';

export enum Paths {
    home = '/',
    about = '/about',
    users = '/users',
    repo = 'https://github.com/RyanDur/ChosenPicachu',
    artGallery = '/art',
}

export const App = () => {
    const pageTitles = [{
        page: useRouteMatch(Paths.home),
        title: 'Home Page'
    }, {
        page: useRouteMatch(Paths.about),
        title: 'About Page'
    }, {
        page: useRouteMatch(Paths.users),
        title: 'Users Page'
    }, {
        page: useRouteMatch(Paths.artGallery),
        title: 'Art Gallery Page'
    }];

    return <>
        <header id="app-header">
            <h1 className="title">{pageTitles.find(({page}) => page?.isExact)?.title}</h1>
        </header>
        <aside id="side-nav">
            <nav id="app-navigation" className="inset-right">
                <Link id="navigate-home" className="path" to={Paths.home}>Home</Link>
                <Link id="navigate-about" className="path" to={Paths.about}>About</Link>
                <Link id="navigate-form" className="path" to={Paths.users}>Users</Link>
                <Link id="navigate-form" className="path" to={Paths.artGallery}>Art</Link>
                <Link id="navigate-repo" className="path" to={{pathname: Paths.repo}} rel="noopener" target="_blank">Repo</Link>
            </nav>
        </aside>
        <main className="gutter">
            <Switch>
                <Route path={Paths.home} exact>
                    <Home/>
                </Route>
                <Route path={Paths.about} exact>
                    <About/>
                </Route>
                <Route path={Paths.users} exact>
                    <Users/>
                </Route>
                <Route path={Paths.artGallery} exact>
                    <ArtGallery/>
                </Route>
            </Switch>
        </main>
    </>;
};
