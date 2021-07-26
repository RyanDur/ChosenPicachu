import {useParams} from 'react-router-dom';
import './Piece.scss';
import {useEffect, useState} from 'react';
import {Piece} from '../../../data/types';
import {data} from '../../../data';

export const ArtWork = () => {
    const [piece, updatePiece] = useState<Piece>();
    const {id} = useParams<{ id: string }>();

    useEffect(() => {
        id && data.getPiece(id, updatePiece);
    }, [id]);

    if (piece?.imageId) {
        return <figure className="card">
            <img className="loading piece"
                 onError={event => event.currentTarget.classList.remove('loading')}
                 onLoad={event => event.currentTarget.classList.remove('loading')}
                 alt={piece?.altText} title={piece?.title}
                 loading="lazy" data-testid={`piece-${piece?.imageId}`}
                 src={`https://www.artic.edu/iiif/2/${piece?.imageId}/full/,2000/0/default.jpg`}/>
            <figcaption className="title">{piece?.title}</figcaption>
        </figure>;
    } else {
        return <article className="loading"/>;
    }
};