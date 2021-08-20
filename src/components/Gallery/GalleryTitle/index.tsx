import {FC} from 'react';
import {Route, Switch} from 'react-router-dom';
import {useArtPiece} from '../ArtPiece';
import {Paths} from '../../../App';

export const GalleryTitle: FC = () => {
    const {piece} = useArtPiece();

    return <Switch>
        <Route path={Paths.artGallery} exact>Art Gallery</Route>
        <Route path={Paths.artGalleryPiece} exact>{piece.title}</Route>
    </Switch>;
};