import {useParams} from 'react-router';
import {useEffect} from 'react';
import {maybe} from '@ryandur/sand';
import {Loading} from '@components/Loading';
import {useArtPiece} from '@pages/Gallery/ArtPiece/Context';
import {Image} from '@pages/Gallery/Image';
import {awaited} from '@pages/Gallery/museums/reply';
import {useSearchParamsObject} from '@components/search-params';
import {Source, sourceParam} from '@pages/Gallery/museums/source';
import {useBanners} from '@components/Banners';
import {troubleWith} from '@transport/trouble';
import {art} from '@pages/Gallery/museums';
import noImage from '../../../assets/icons/missing-art.svg?url';
import './Piece.css';
import {StandIn} from '@pages/Gallery/StandIn';

export const ArtPiece = () => {
  const {easel, asked, answered, refused, abandoned} = useArtPiece();
  const {raise} = useBanners();
  const {tab} = useSearchParamsObject({tab: sourceParam});
  const {id} = useParams<{id: string}>();

  useEffect(() => maybe(id)
    .map(chosen => {
      const {cancel} = art.get({id: chosen, source: tab ?? Source.AIC})
        .onPending(pending => pending && asked())
        .onSuccess(answered)
        .onFailure(error => {
          refused();
          raise(troubleWith('the museum')(error));
        });
      return () => {
        cancel();
        abandoned();
      };
    })
    .orElse(abandoned), [id, tab, asked, answered, refused, abandoned, raise]);

  return <>
    {awaited(easel) && <Loading label="loading piece"/>}
    {easel.reply === 'answered' && <figure className="art-work">
      <Image piece={easel.answer} linkEnabled={false} className="piece hung"/>
      <figcaption className="artist-display trim hairline-outline italic caption ink">{easel.answer.artistInfo ?? 'Unknown'}</figcaption>
    </figure>}
    {easel.reply === 'refused' && <StandIn src={noImage} alt="the museum refused to answer"/>}
  </>;
};
