import {FC} from 'react';
import {Route, Switch, useRouteMatch} from 'react-router-dom';
import {ArtGallery} from './Art';
import {ArtPiece} from './ArtPiece';
import {GalleryTitle} from './GalleryTitle';
import {GalleryNav} from './Nav';

export enum GalleryPath {
    piece = '/:id'
}

const Gallery: FC = () => {
    const {path} = useRouteMatch();
    return <Switch>
        <Route path={path} exact><ArtGallery/></Route>
        <Route path={`${path}${GalleryPath.piece}`} exact><ArtPiece/></Route>
    </Switch>;
};

export {
    Gallery,
    GalleryNav,
    GalleryTitle
};