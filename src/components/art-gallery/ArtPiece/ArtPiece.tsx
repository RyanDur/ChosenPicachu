import {useParams} from 'react-router';
import {useEffect, useState} from 'react';
import {Loading} from '@components/Loading';
import {useArtPiece} from '@components/art-gallery/ArtPiece/Context';
import {Image} from '@components/art-gallery/Image';
import {useSearchParamsObject} from '@components/search-params';
import {Source, sourceParam} from '@components/art-gallery/museums/source';
import {MuseumReply} from '@components/art-gallery/museums/reply';
import {has} from '@ryandur/sand';
import {useBanners} from '@components/Banners';
import {troubleWith} from '@transport/trouble';
import {art} from '@components/art-gallery/museums';
import noImage from '../../../assets/icons/missing-art.svg?url';
import './Piece.css';

export const ArtPiece = () => {
  const {piece, updatePiece, reset} = useArtPiece();
  const {raise} = useBanners();
  const {tab} = useSearchParamsObject({tab: sourceParam});
  const {id} = useParams<{ id: string }>();
  const [museum, setMuseum] = useState<MuseumReply>('unasked');
  const hung = piece.orNull();

  useEffect(() => {
    if (!id) return reset;
    const {cancel} = art.get({id, source: tab ?? Source.AIC})
      .onPending(pending => pending && setMuseum('asked'))
      .onSuccess(found => {
        updatePiece(found);
        setMuseum('answered');
      })
      .onFailure(error => {
        setMuseum('refused');
        raise(troubleWith('the museum')(error));
      });
    return () => {
      cancel();
      reset();
    };
  }, [id, updatePiece, tab, reset, raise]);

  return <>
    {museum === 'asked' && <Loading label="loading piece"/>}
    {has(hung) && <figure className="art-work">
        <Image piece={hung} linkEnabled={false} className="piece hung"/>
        <figcaption className="trim artist-display hairline-outline italic">{hung.artistInfo}</figcaption>
    </figure>}
    {museum === 'refused' && <img className="stand-in" src={noImage} alt="the museum refused to answer"/>}
  </>;
};
