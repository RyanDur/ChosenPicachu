import React, {FC} from 'react';
import {Route, Switch, useRouteMatch} from 'react-router-dom';
import {ArtGallery} from './Art';
import {ArtPiece} from './ArtPiece';
import {GalleryTitle} from './GalleryTitle';
import {GalleryNav} from './Nav';
import {Tabs} from '../Tabs';

export enum GalleryPath {
    piece = '/:id'
}

const Gallery: FC = () => {
    const {path} = useRouteMatch();
    return <>
        <Tabs values={[
            {display: 'The Art Institute of Chicago', param: 'aic'},
            {display: 'The Smithsonian', param: 'smithsonian'}
        ]}/>
        <Switch>
            <Route path={path} exact><ArtGallery/></Route>
            <Route path={`${path}${GalleryPath.piece}`} exact><ArtPiece/></Route>
        </Switch>
    </>;
};

export {
    Gallery,
    GalleryNav,
    GalleryTitle
};