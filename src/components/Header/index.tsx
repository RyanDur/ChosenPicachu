import React from 'react';
import {useRouteMatch} from 'react-router-dom';
import {Paths} from '../../App';
import {useArtPiece} from '../ArtGallery/ArtPiece/Context';

export const Header = () => {
    const {piece} = useArtPiece();
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
    }, {
        page: useRouteMatch(Paths.artGalleryPiece),
        title: piece.title
    }];

    return <header id="app-header">
        <h1 className="title">{pageTitles.find(({page}) => page?.isExact)?.title}</h1>
    </header>;
};