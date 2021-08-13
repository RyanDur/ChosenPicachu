import React from 'react';
import {Link, Route, Switch, useRouteMatch} from 'react-router-dom';
import {About, ArtGallery, ArtPiece, GalleryNav, Home, Users} from './components';
import {useArtPiece} from './components/Gallery/ArtPiece';
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
                    <Route path={Paths.artGalleryPiece} exact>{piece && piece.title}</Route>
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

            <article className="icons borrowed-assets" tabIndex={0}>
                <h3 className="icons-title">ICONS</h3>
                <nav className="icons-content">
                    <a href="https://icons8.com/icon/622/detective" className="attribution">Detective icon by Icons8</a>
                    <a href="https://icons8.com/icon/j1UxMbqzPi7n/no-image" className="attribution">No Image icon by Icons8</a>
                    <a href="https://icons8.com/icon/EJK2FdL08858/no-image-gallery" className="attribution">No Image Gallery icon by Icons8</a>
                </nav>
            </article>
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
