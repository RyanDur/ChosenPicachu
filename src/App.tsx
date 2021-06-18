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
        <header id="app-header" className="grid">
            <h1 className="title">{pageTitles.find(({page}) => page?.isExact)?.title}</h1>
        </header>
        <nav className="navigation">
            <Link to={Paths.home}>Home</Link>
            <Link to={Paths.about}>About</Link>
        </nav>
        <main className="component center">
            <Switch>
                <Route path={Paths.home}>
                    <Home/>
                </Route>
                <Route path={Paths.about}>
                    <About/>
                </Route>
            </Switch>
        </main>
    </>;
};
