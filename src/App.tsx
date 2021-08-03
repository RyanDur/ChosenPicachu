import React from 'react';
import {Link, Route, Switch, useRouteMatch} from 'react-router-dom';
import {About, ArtGallery, ArtPiece, GalleryNav, Home, Users} from './components';
import {useArtPiece} from './components/ArtGallery/ArtPiece';
import {join} from './components/util';
import './App.scss';
import './App.layout.scss';

export enum Paths {
    home = '/',
    about = '/about',
    users = '/users',
    artGallery = '/art',
    artGalleryPiece = '/art/:id',
    repo = 'https://github.com/RyanDur/ChosenPicachu',
}

export const App = () => {
    const {piece} = useArtPiece();

    return <>
        <header id="app-header" data-testid="header">
            <h1 className="title">
                <Switch>
                    <Route path={Paths.home} exact>Home</Route>
                    <Route path={Paths.about} exact>About</Route>
                    <Route path={Paths.users} exact>Users</Route>
                    <Route path={Paths.artGallery} exact>Art Gallery</Route>
                    <Route path={Paths.artGalleryPiece} exact>{piece.title}</Route>
                </Switch>
            </h1>
        </header>
        <aside id="side-nav" data-testid="navigation">
            <nav id="app-navigation">
                <Link id="navigate-home" className="path" to={Paths.home}>Home</Link>
                <Link id="navigate-about" className="path" to={Paths.about}>About</Link>
                <Link id="navigate-users" className="path" to={Paths.users}>Users</Link>
                <Link id="navigate-form" className="path" to={Paths.artGallery}>Art</Link>
                <a id="navigate-repo" className="path" href={Paths.repo}
                   rel="noopener noreferrer" target="_blank">Repo</a>
            </nav>
        </aside>
        <main data-testid="main">
            <Switch>
                <Route path={Paths.home} exact><Home/></Route>
                <Route path={Paths.about} exact><About/></Route>
                <Route path={Paths.users} exact><Users/></Route>
                <Route path={Paths.artGallery} exact><ArtGallery/></Route>
                <Route path={Paths.artGalleryPiece} exact><ArtPiece/></Route>
            </Switch>
        </main>
        <footer id={'app-footer'}
                className={join(useRouteMatch(Paths.artGallery)?.isExact && 'stick-to-bottom')}
                data-testid="footer">
            <Switch>
                <Route path={Paths.artGallery} exact><GalleryNav/></Route>
            </Switch>
        </footer>
    </>;
};
