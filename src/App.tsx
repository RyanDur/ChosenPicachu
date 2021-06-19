import React from 'react';
import {Link, Route, Switch, useRouteMatch} from 'react-router-dom';
import './App.css';
import {About, Home} from './components';

export enum Paths {
    home = '/',
    about = '/about'
}

export const App = () => {
    const pageTitles = [{
        page: useRouteMatch(Paths.home),
        title: 'Home Page'
    }, {
        page: useRouteMatch(Paths.about),
        title: 'About Page'
    }];

    return <>
        <header id="app-header">
            <h1 className="title">{pageTitles.find(({page}) => page?.isExact)?.title}</h1>
        </header>
        <nav id="app-navigation" className="overhang">
            <Link id="navigate-home" className="path" to={Paths.home}>Home</Link>
            <Link id="navigate-about" className="path" to={Paths.about}>About</Link>
        </nav>
        <main className="overhang gutter">
            <Switch>
                <Route path={Paths.home} exact>
                    <Home/>
                </Route>
                <Route path={Paths.about} exact>
                    <About/>
                </Route>
            </Switch>
        </main>
    </>;
};
