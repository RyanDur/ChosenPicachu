import {FC, useEffect} from 'react';
import {Loading} from '@components/Loading';
import {Image} from '@pages/Gallery/Image';
import {useGallery} from '@pages/Gallery/Context';
import {empty, maybe} from '@ryandur/sand';
import {useBanners} from '@components/Banners';
import {troubleWith} from '@transport/trouble';
import {art as artResource, replyChange, museumReply} from '@pages/Gallery/museums';
import noImageGallery from '../../../assets/icons/missing-wall.svg?url';
import './Gallery.css';
import {StandIn} from '@pages/Gallery/StandIn';

export const ArtGallery: FC = () => {
  const {wall, dispatch, page, size, search, tab} = useGallery();
  const {raise} = useBanners();

  useEffect(() => maybe(tab)
    .map(source => {
      const {cancel} = artResource.getAll({page, size, search, source})
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
    .orElse(() => dispatch(replyChange.abandoned())), [page, search, tab, size, dispatch, raise]);

  return <>
    <ul id="art-gallery">
      {wall.reply === 'answered' && wall.answer.pieces.map((piece, index) => <li className="frame" key={piece.id}>
        <figure>
          <div className="wall-slot">
            <Image className="piece hung liftable" piece={piece} priority={index === 0} lazy={index >= 6}/>
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
