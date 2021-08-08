import {useParams} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {data} from '../../../data';
import {Loading} from '../../Loading';
import {ArtPieceContext, useArtPiece, useArtPieceContext} from './Context';
import {Image} from '../Image';
import {AsyncState} from '../../../data/types';
import {GetPieceAction} from '../../../data/actions';
import './Piece.scss';

const ArtPiece = () => {
    const {piece, updatePiece, reset} = useArtPiece();
    const [loading, isLoading] = useState(false);
    const {id} = useParams<{ id: string }>();

    useEffect(() => {
        id && data.getPiece(id, (action: GetPieceAction) => {
            isLoading(action.type === AsyncState.LOADING);
            if (action.type === AsyncState.SUCCESS) updatePiece(action.value);
        });
        return reset;
    }, [id, updatePiece]);

    return loading ? <Loading testId="loading-piece"/> :
        <figure className="card art-work">
            <Image piece={piece} height={2000} linkEnabled={false} className="piece"/>
            <figcaption className="artist-display">{piece.artistInfo}</figcaption>
        </figure>;
};

export {
    ArtPiece,
    ArtPieceContext,
    useArtPieceContext,
    useArtPiece
};