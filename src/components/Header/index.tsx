import React from 'react';
import {Route, Switch} from 'react-router-dom';
import {Paths} from '../../App';
import {useArtPiece} from '../ArtGallery/ArtPiece';
import './Header.scss';
import './Header.layout.scss';

export const Title = () => {
    const {piece} = useArtPiece();

    return <h1 className="title">
        <Switch>
            <Route path={Paths.home} exact>Home</Route>
            <Route path={Paths.about} exact>About</Route>
            <Route path={Paths.users} exact>Users</Route>
            <Route path={Paths.artGallery} exact>Art Gallery</Route>
            <Route path={Paths.artGalleryPiece} exact>{piece.title}</Route>
        </Switch>
    </h1>;
};