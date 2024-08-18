import {useParams} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {Loading} from '../../Loading';
import {useArtPiece} from './Context';
import {Image} from '../Image';
import {useQuery} from '../../hooks';
import {Source} from '../resource/types/resource';
import {has, not} from '@ryandur/sand';
import {art} from '../resource';
import './Piece.css';

export const ArtPiece = () => {
    const {piece, updatePiece, reset} = useArtPiece();
    const {queryObj: {tab}} = useQuery<{ tab: Source }>();
    const [errored, hasErrored] = useState(false);
    const [loading, isLoading] = useState(false);
    const {id} = useParams<{ id: string }>();

    useEffect(() => {
        id && art.get({id, source: tab ?? Source.AIC})
            .onPending(isLoading)
            .onSuccess(updatePiece)
            .onFailure(() => hasErrored(true));
        return reset;
    }, [id, updatePiece, tab]);

    return <>
        {loading && <Loading testId="loading-piece"/>}
        {has(piece) && not(errored) && <figure className="art-work" data-testid="image-figure">
          <Image piece={piece} linkEnabled={false} className="piece"/>
          <figcaption className="artist-display">{piece.artistInfo}</figcaption>
        </figure>}
        {errored && <article className="err">
          <img src="https://img.icons8.com/ios/100/000000/no-image.png"
               alt="Load Error"
               data-testid="image-error"/>
        </article>}
    </>;
};
