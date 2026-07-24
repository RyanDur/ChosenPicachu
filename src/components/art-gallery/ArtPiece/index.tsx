import {useParams} from 'react-router';
import {useEffect, useState} from 'react';
import {Loading} from '@components/art-gallery/Loading';
import {useArtPiece} from '@components/art-gallery/ArtPiece/Context';
import {Image} from '@components/art-gallery/Image';
import {useSearchParamsObject} from '@components/search-params';
import {Source, sourceParam} from '@components/art-gallery/museums/types/resource';
import {has, not} from '@ryandur/sand';
import {art} from '@components/art-gallery/museums';
import noImage from '../../../assets/icons/no-image.png';
import './Piece.css';

export const ArtPiece = () => {
    const {piece, updatePiece, reset} = useArtPiece();
    const {tab} = useSearchParamsObject({tab: sourceParam});
    const {id} = useParams<{ id: string }>();
    const [errored, hasErrored] = useState(false);
    const [loading, isLoading] = useState(false);

    useEffect(() => {
        if (!id) return reset;
        const {cancel} = art.get({id, source: tab ?? Source.AIC})
            .onPending(isLoading)
            .onSuccess(updatePiece)
            .onFailure(() => hasErrored(true));
        return () => {
            cancel();
            reset();
        };
    }, [id, updatePiece, tab, reset]);

    return <>
        {loading && <Loading testId="loading-piece"/>}
        {has(piece) && not(errored) && <figure className="art-work" data-testid="image-figure">
          <Image piece={piece} linkEnabled={false} className="piece"/>
          <figcaption className="artist-display">{piece.artistInfo}</figcaption>
        </figure>}
        {errored && <article className="err">
          <img src={noImage}
               alt="Load Error"
               data-testid="image-error"/>
        </article>}
    </>;
};
