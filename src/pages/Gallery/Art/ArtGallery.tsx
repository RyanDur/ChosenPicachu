import {FC, useEffect} from 'react';
import {Loading} from '@components/Loading';
import {Image} from '@pages/Gallery/Image';
import {useGallery} from '@pages/Gallery/Context';
import {empty, maybe} from '@ryandur/sand';
import {bannerChange, useBannerDispatch} from '@frame/notices/Banners';
import {trouble} from '@transport';
import {art as artResource, museumReply} from '@pages/Gallery/museums';
import noImageGallery from '../../../assets/icons/missing-wall.svg?url';
import './Gallery.css';
import {StandIn} from '@pages/Gallery/StandIn';

export const ArtGallery: FC = () => {
  const {wall, dispatch, page, size, search, tab} = useGallery();
  const dispatchBanner = useBannerDispatch();

  useEffect(() => museumReply.ask(
    maybe(tab).map(source => () => artResource.getAll({page, size, search, source})),
    dispatch,
    error => dispatchBanner(bannerChange.raised(trouble.with('the museum')(error)))
  ), [page, search, tab, size, dispatch, dispatchBanner]);

  return <>
    <ul id="art-gallery">
      {wall.reply === 'answered' && wall.answer.pieces.map((piece, index) => <li className="frame" key={piece.id}>
        <figure>
          <div className="wall-slot">
            <Image className="piece hung" piece={piece} priority={index === 0} lazy={index >= 6}/>
          </div>
          <figcaption className="placard trim hairline-outline italic caption ink">{piece.title}</figcaption>
        </figure>
      </li>)}
    </ul>
    {museumReply.awaited(wall) && <Loading label="loading gallery"/>}
    {wall.reply === 'answered' && empty(wall.answer.pieces) &&
        <StandIn src={noImageGallery} alt="the museum answered with nothing"/>}
    {wall.reply === 'refused' && <StandIn src={noImageGallery} alt="the museum refused to answer"/>}
  </>;
};
