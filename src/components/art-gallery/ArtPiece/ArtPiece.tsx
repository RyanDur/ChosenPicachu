import {useParams} from 'react-router';
import {useEffect} from 'react';
import {Loading} from '@components/Loading';
import {useArtPiece} from '@components/art-gallery/ArtPiece/Context';
import {Image} from '@components/art-gallery/Image';
import {useSearchParamsObject} from '@components/search-params';
import {Source, sourceParam} from '@components/art-gallery/museums/source';
import {useBanners} from '@components/Banners';
import {troubleWith} from '@transport/trouble';
import {art} from '@components/art-gallery/museums';
import noImage from '../../../assets/icons/missing-art.svg?url';
import './Piece.css';

export const ArtPiece = () => {
  const {piece, asked, answered, refused, reset} = useArtPiece();
  const {raise} = useBanners();
  const {tab} = useSearchParamsObject({tab: sourceParam});
  const {id} = useParams<{ id: string }>();

  useEffect(() => {
    if (!id) return reset;
    const {cancel} = art.get({id, source: tab ?? Source.AIC})
      .onPending(pending => pending && asked())
      .onSuccess(answered)
      .onFailure(error => {
        refused();
        raise(troubleWith('the museum')(error));
      });
    return () => {
      cancel();
      reset();
    };
  }, [id, tab, asked, answered, refused, reset, raise]);

  return <>
    {piece.reply === 'asked' && <Loading label="loading piece"/>}
    {piece.reply === 'answered' && <figure className="art-work">
        <Image piece={piece.answer} linkEnabled={false} className="piece hung"/>
        <figcaption className="artist-display trim hairline-outline italic">{piece.answer.artistInfo}</figcaption>
    </figure>}
    {piece.reply === 'refused' && <img className="stand-in" src={noImage} alt="the museum refused to answer"/>}
  </>;
};
