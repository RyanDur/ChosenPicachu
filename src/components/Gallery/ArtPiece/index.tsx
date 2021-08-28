import {useParams} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {data} from '../../../data';
import {Loading} from '../../Loading';
import {ArtPieceContext, useArtPiece, useArtPieceContext} from './Context';
import {Image} from '../Image';
import {AsyncState} from '../../../data/types';
import {GetPieceAction} from '../../../data/actions';
import {useURL} from '../../hooks';
import './Piece.scss';

const ArtPiece = () => {
    const {piece, updatePiece, reset} = useArtPiece();
    const [loading, isLoading] = useState(false);
    const [errored, isErrored] = useState(false);
    const {id} = useParams<{ id: string }>();
    const {queryObj: {tab}} = useURL<{ tab: string }>();

    useEffect(() => {
        id && data.getPiece({id, source: tab}, (action: GetPieceAction) => {
            isLoading(action.type === AsyncState.LOADING);
            isErrored(action.type === AsyncState.ERROR);
            if (action.type === AsyncState.LOADED) updatePiece(action.value);
        });
        return reset;
    }, [id, updatePiece]);

    return <>
        {loading && <Loading testId="loading-piece"/>}
        {!loading && !errored && piece && <figure className="art-work" data-testid="image-figure">
          <Image piece={piece} linkEnabled={false} className="piece"/>
          <figcaption className="artist-display">{piece.artistInfo}</figcaption>
        </figure>}
        {errored && <img src="https://img.icons8.com/ios/50/ffffff/no-image.png"
                         alt="Load Error" data-testid="image-error"/>}
    </>;
};

export {
    ArtPiece,
    ArtPieceContext,
    useArtPieceContext,
    useArtPiece
};