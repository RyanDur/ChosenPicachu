import React, {FC} from 'react';
import {Route, Switch, useRouteMatch} from 'react-router-dom';
import {ArtGallery} from './Art';
import {ArtPiece} from './ArtPiece';
import {GalleryTitle} from './GalleryTitle';
import {GalleryNav} from './Nav';
import {Tabs} from '../Tabs';
import {PageControl} from './PageControl';
import {Source} from '../../data/artGallery/types/resource';

export enum GalleryPath {
    piece = '/:id'
}

const Gallery: FC = () => {
    const {path} = useRouteMatch();
    return <Switch>
        <Route path={path} exact>
            <Tabs values={[
                {display: 'The Art Institute of Chicago', param: Source.AIC},
                {display: 'Harvard Art Museums', param: Source.HARVARD},
                {display: 'Rijksstudio', param: Source.RIJKS}
            ]}/>
            <ArtGallery/>
        </Route>
        <Route path={`${path}${GalleryPath.piece}`} exact><ArtPiece/></Route>
    </Switch>;
};

export {
    Gallery,
    GalleryNav,
    GalleryTitle,
    PageControl
};