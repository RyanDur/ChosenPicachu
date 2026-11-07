import {useParams} from 'react-router';
import {useEffect} from 'react';
import {maybe} from '@ryandur/sand';
import {Loading} from '@components/Loading';
import {useArtPiece} from '@pages/Gallery/ArtPiece/Context';
import {Image} from '@pages/Gallery/Image';
import {Source} from '@pages/Gallery/museums/source';
import {useGallery} from '@pages/Gallery/Context';
import {useBanners} from '@components/Banners';
import {troubleWith} from '@transport/trouble';
import {art, replyChange, museumReply} from '@pages/Gallery/museums';
import noImage from '../../../assets/icons/missing-art.svg?url';
import './Piece.css';
import {StandIn} from '@pages/Gallery/StandIn';

export const ArtPiece = () => {
  const {easel, dispatch} = useArtPiece();
  const {raise} = useBanners();
  const {tab} = useGallery();
  const {id} = useParams<{id: string}>();

  useEffect(() => maybe(id)
    .map(chosen => {
      const {cancel} = art.get({id: chosen, source: tab ?? Source.AIC})
        .onPending(pending => pending && dispatch(replyChange.asked()))
        .onSuccess(answer => dispatch(replyChange.answered(answer)))
        .onFailure(error => {
          dispatch(replyChange.refused());
          raise(troubleWith('the museum')(error));
        });
      return () => {
        cancel();
        dispatch(replyChange.abandoned());
      };
    })
    .orElse(() => dispatch(replyChange.abandoned())), [id, tab, dispatch, raise]);

  return <>
    {museumReply.awaited(easel) && <Loading label="loading piece"/>}
    {easel.reply === 'answered' && <figure className="art-work">
      <Image piece={easel.answer} linkEnabled={false} className="piece hung"/>
      <figcaption className="artist-display trim hairline-outline italic caption ink">{easel.answer.artistInfo ?? 'Unknown'}</figcaption>
    </figure>}
    {easel.reply === 'refused' && <StandIn src={noImage} alt="the museum refused to answer"/>}
  </>;
};
