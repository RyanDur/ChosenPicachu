import React from 'react';
import {Link, Route, Switch} from 'react-router-dom';
import {About, ArtGallery, Home, Users} from './components';
import {ArtPiece} from './components/ArtGallery/ArtPiece';
import {ArtPieceContext, useArtPieceContext} from './components/ArtGallery/ArtPiece/Context';
import {Header} from './components/Header';
import './App.scss';
import './App.layout.css';

export enum Paths {
    home = '/',
    about = '/about',
    users = '/users',
    artGallery = '/art',
    artGalleryPiece = '/art/:id',
    repo = 'https://github.com/RyanDur/ChosenPicachu',
}

export const App = () => <ArtPieceContext.Provider value={useArtPieceContext()}>
    <Header/>
    <aside id="side-nav">
        <nav id="app-navigation" className="inset-right">
            <Link id="navigate-home" className="path" to={Paths.home}>Home</Link>
            <Link id="navigate-about" className="path" to={Paths.about}>About</Link>
            <Link id="navigate-users" className="path" to={Paths.users}>Users</Link>
            <Link id="navigate-form" className="path" to={Paths.artGallery}>Art</Link>
            <a id="navigate-repo" className="path" href={Paths.repo}
               rel="noopener noreferrer" target="_blank">Repo</a>
        </nav>
    </aside>
    <main>
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
            <Route path={Paths.artGalleryPiece} exact>
                <ArtPiece/>
            </Route>
        </Switch>
    </main>
</ArtPieceContext.Provider>;
