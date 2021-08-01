import {useParams} from 'react-router-dom';
import {useEffect} from 'react';
import {data} from '../../../data';
import {Loading} from '../../Loading';
import {useArtPiece} from './Context';
import './Piece.scss';
import {Image} from '../Image';

export const ArtPiece = () => {

    const {piece, updatePiece} = useArtPiece();
    const {id} = useParams<{ id: string }>();

    useEffect(() => {
        id && data.getPiece(id, updatePiece);
        return () => updatePiece({});
    }, [id, updatePiece]);

    if (piece?.imageId) {
        return <figure className="card">
            <Image piece={piece} height={2000}/>
            <figcaption className="artist-display">{piece.artistInfo}</figcaption>
        </figure>;
    } else return <Loading/>;
};