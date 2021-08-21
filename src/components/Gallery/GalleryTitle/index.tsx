import {FC} from 'react';
import {Route, Switch, useRouteMatch} from 'react-router-dom';
import {useArtPiece} from '../ArtPiece';
import {GalleryPath} from '../index';

export const GalleryTitle: FC = () => {
    const {piece} = useArtPiece();
    const {path} = useRouteMatch();

    return <Switch>
        <Route path={path} exact>Gallery</Route>
        <Route path={`${path}${GalleryPath.piece}`} exact>{piece.title}</Route>
    </Switch>;
};