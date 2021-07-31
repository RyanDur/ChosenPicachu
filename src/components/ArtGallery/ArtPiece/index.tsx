import {useParams} from 'react-router-dom';
import {useEffect} from 'react';
import {data} from '../../../data';
import {Loading} from '../../Loading';
import {useArtPiece} from './Context';
import './Piece.scss';

export const ArtPiece = () => {
    const {piece, updatePiece} = useArtPiece();
    const {id} = useParams<{ id: string }>();

    useEffect(() => {
        id && data.getPiece(id, updatePiece);
        return () => updatePiece({});
    }, [id, updatePiece]);

    if (piece?.imageId) {
        return <figure className="card loading">
            <img className="piece"
                 onError={event => event.currentTarget.parentElement?.classList.remove('loading')}
                 onLoad={event => event.currentTarget.parentElement?.classList.remove('loading')}
                 alt={piece.altText} title={piece.title}
                 loading="lazy" data-testid={`piece-${piece.imageId}`}
                 src={`https://www.artic.edu/iiif/2/${piece.imageId}/full/,2000/0/default.jpg`}/>
            <figcaption className="artist-info">{piece.artistInfo}</figcaption>
        </figure>;
    } else return <Loading/>;
};