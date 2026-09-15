import {useParams} from 'react-router';
import {useEffect} from 'react';
import {maybe} from '@ryandur/sand';
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
    {easel.reply === 'asked' && <Loading label="loading piece"/>}
    {easel.reply === 'answered' && <figure className="art-work">
      <Image piece={easel.answer} linkEnabled={false} className="piece hung"/>
      <figcaption className="artist-display trim hairline-outline italic">{easel.answer.artistInfo}</figcaption>
    </figure>}
    {easel.reply === 'refused' && <img className="stand-in" src={noImage} alt="the museum refused to answer"/>}
  </>;
};
