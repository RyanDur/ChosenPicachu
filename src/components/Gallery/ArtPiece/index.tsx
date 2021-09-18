import {useParams} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {data} from '../../../data';
import {Loading} from '../../Loading';
import {ArtPieceContext, useArtPiece, useArtPieceContext} from './Context';
import {Image} from '../Image';
import {AsyncState, HTTPError} from '../../../data/types';
import {useQuery} from '../../hooks';
import {Art, Source} from '../../../data/artGallery/types';
import {AsyncEvent} from '@ryandur/sand';
import './Piece.scss';

const ArtPiece = () => {
    const {piece, updatePiece, reset} = useArtPiece();
    const [loading, isLoading] = useState(false);
    const [errored, isErrored] = useState(false);
    const {id} = useParams<{ id: string }>();
    const {queryObj: {tab}} = useQuery<{ tab: Source }>();

    useEffect(() => {
        id && data.artGallery.getArt({id, source: tab})
            .onAsyncEvent((event: AsyncEvent<Art, HTTPError>) => {
                isLoading(event.type === AsyncState.LOADING);
                isErrored(event.type === AsyncState.ERROR);
                if (event.type === AsyncState.LOADED) updatePiece(event.data);
            });
        return reset;
    }, [id, updatePiece]);

    return <>
        {loading && <Loading testId="loading-piece"/>}
        {!loading && !errored && piece && <figure className="art-work" data-testid="image-figure">
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