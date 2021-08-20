import {FC} from 'react';
import {Route, Switch} from 'react-router-dom';
import {ArtGallery} from './Art';
import {ArtPiece} from './ArtPiece';
import {GalleryTitle} from './GalleryTitle';
import {GalleryNav} from './Nav';
import {Paths} from '../../App';

const Gallery: FC = () => {
    return <Switch>
        <Route path={Paths.artGallery} exact><ArtGallery/></Route>
        <Route path={Paths.artGalleryPiece} exact><ArtPiece/></Route>
    </Switch>;
};

export {
    Gallery,
    GalleryNav,
    GalleryTitle
};