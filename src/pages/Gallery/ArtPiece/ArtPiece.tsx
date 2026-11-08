import {useParams} from 'react-router';
import {useEffect} from 'react';
import {maybe} from '@ryandur/sand';
import {Loading} from '@components/Loading';
import {useArtPiece} from '@pages/Gallery/ArtPiece/Context';
import {Image} from '@pages/Gallery/Image';
import {useGallery} from '@pages/Gallery/Context';
import {opening} from '@pages/Gallery/opening';
import {bannerChange, useBannerDispatch} from '@notices/Banners';
import {trouble} from '@transport';
import {art, museumReply} from '@pages/Gallery/museums';
import noImage from '../../../assets/icons/missing-art.svg?url';
import './Piece.css';
import {StandIn} from '@pages/Gallery/StandIn';

export const ArtPiece = () => {
  const {easel, dispatch} = useArtPiece();
  const dispatchBanner = useBannerDispatch();
  const {tab} = useGallery();
  const {id} = useParams<{id: string}>();

  useEffect(() => museumReply.ask(
    maybe(id).map(chosen => () => art.get({id: chosen, source: tab ?? opening.museum})),
    dispatch,
    error => dispatchBanner(bannerChange.raised(trouble.with('the museum')(error)))
  ), [id, tab, dispatch, dispatchBanner]);

  return <>
    {museumReply.awaited(easel) && <Loading label="loading piece"/>}
    {easel.reply === 'answered' && <figure className="art-work">
      <Image piece={easel.answer} linkEnabled={false} className="piece hung"/>
      <figcaption className="artist-display trim hairline-outline italic caption ink">{easel.answer.artistInfo ?? 'Unknown'}</figcaption>
    </figure>}
    {easel.reply === 'refused' && <StandIn src={noImage} alt="the museum refused to answer"/>}
  </>;
};
