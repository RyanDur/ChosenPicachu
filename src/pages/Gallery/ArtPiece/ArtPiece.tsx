import {FC, Suspense, useEffect} from 'react';
import {Await} from 'react-router';
import {Loading} from '@components/Loading';
import {Image} from '@pages/Gallery/Image';
import {bannerChange, useBannerDispatch} from '@banners';
import {HTTPError, trouble} from '@transport';
import {Art} from '@pages/Gallery/museums';
import noImage from '../../../assets/icons/missing-art.svg?url';
import './Piece.css';
import {StandIn} from '@pages/Gallery/StandIn';
import {askedPiece} from './askedPiece';

const Hung: FC<{piece: Art}> = ({piece}) =>
  <figure className="art-work">
    <Image piece={piece} linkEnabled={false} className="piece hung"/>
    <figcaption className="artist-display trim hairline-outline italic caption ink">{piece.artistInfo ?? 'Unknown'}</figcaption>
  </figure>;

const Refused: FC<{error: HTTPError}> = ({error}) => {
  const dispatchBanner = useBannerDispatch();
  useEffect(() => dispatchBanner(bannerChange.raised(trouble.with('the museum')(error))), [error, dispatchBanner]);
  return <StandIn src={noImage} alt="the museum refused to answer"/>;
};

export const ArtPiece: FC = () =>
  <Suspense fallback={<Loading label="loading piece"/>}>
    <Await resolve={askedPiece.useAsked().piece}>
      {answer => answer.either(piece => <Hung piece={piece}/>, error => <Refused error={error}/>)}
    </Await>
  </Suspense>;
