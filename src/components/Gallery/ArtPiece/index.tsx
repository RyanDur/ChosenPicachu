import {useParams} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {data} from '../../../data';
import {Loading} from '../../Loading';
import {ArtPieceContext, useArtPiece, useArtPieceContext} from './Context';
import {Image} from '../Image';
import {useQuery} from '../../hooks';
import {Source} from '../../../data/artGallery/types/resource';
import {has, not} from '@ryandur/sand';
import './Piece.scss';

const ArtPiece = () => {
    const {piece, updatePiece, reset} = useArtPiece();
    const [errored, hasErrored] = useState(false);
    const [loading, isLoading] = useState(false);
    const {id} = useParams<{ id: string }>();
    const {queryObj: {tab}} = useQuery<{ tab: Source }>();

    useEffect(() => {
        id && data.artGallery.getArt({id, source: tab})
            .onLoading(isLoading)
            .onSuccess(updatePiece)
            .onFailure(() => hasErrored(true));
        return reset;
    }, [id, updatePiece]);

    return <>
        {loading && <Loading testId="loading-piece"/>}
        {has(piece) && not(errored) && <figure className="art-work" data-testid="image-figure">
          <Image piece={piece} linkEnabled={false} className="piece"/>
          <figcaption className="artist-display">{piece.artistInfo}</figcaption>
        </figure>}
        {errored && <article className="err"><img src="https://img.icons8.com/ios/100/000000/no-image.png"
                                                  alt="Load Error" data-testid="image-error"/></article>}
    </>;
};

export {
    ArtPiece,
    ArtPieceContext,
    useArtPieceContext,
    useArtPiece
};