import {useParams} from 'react-router';
import {useEffect, useState} from 'react';
import {Loading} from '@components/Loading';
import {useArtPiece} from '@components/art-gallery/ArtPiece/Context';
import {Image} from '@components/art-gallery/Image';
import {useSearchParamsObject} from '@components/search-params';
import {Source, sourceParam} from '@components/art-gallery/museums/types/resource';
import {has, not} from '@ryandur/sand';
import {useBanners} from '@components/Banners';
import {troubleWith} from '@transport/trouble';
import {art} from '@components/art-gallery/museums';
import noImage from '../../../assets/icons/no-image.png';
import './Piece.css';

export const ArtPiece = () => {
    const {piece, updatePiece, reset} = useArtPiece();
    const {raise} = useBanners();
    const {tab} = useSearchParamsObject({tab: sourceParam});
    const {id} = useParams<{ id: string }>();
    const [errored, hasErrored] = useState(false);
    const [loading, isLoading] = useState(false);

    useEffect(() => {
        if (!id) return reset;
        const {cancel} = art.get({id, source: tab ?? Source.AIC})
            .onPending(isLoading)
            .onSuccess(updatePiece)
            .onFailure(error => {
                hasErrored(true);
                raise(troubleWith('the museum')(error));
            });
        return () => {
            cancel();
            reset();
        };
    }, [id, updatePiece, tab, reset, raise]);

    return <>
        {loading && <Loading label="loading piece"/>}
        {has(piece) && not(errored) && <figure className="art-piece art-work">
          <Image piece={piece} linkEnabled={false} className="piece hung"/>
          <figcaption className="artist-display silk hairline-outline italic">{piece.artistInfo}</figcaption>
        </figure>}
        {errored && <article className="art-piece err">
          <img src={noImage}
               alt="Load Error"/>
        </article>}
    </>;
};
