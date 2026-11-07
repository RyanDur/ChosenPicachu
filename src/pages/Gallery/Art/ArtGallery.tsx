import {FC, useEffect} from 'react';
import {numberParam, useSearchParamsObject} from '@components/search-params';
import * as schema from 'schemawax';
import {Loading} from '@components/Loading';
import {Image} from '@pages/Gallery/Image';
import {useGallery} from '@pages/Gallery/Art/Context';
import {empty, maybe} from '@ryandur/sand';
import {useBanners} from '@components/Banners';
import {troubleWith} from '@transport/trouble';
import {sourceParam} from '@pages/Gallery/museums/source';
import {awaited} from '@pages/Gallery/museums/reply';
import {art as artResource} from '@pages/Gallery/museums';
import {defaultRecordLimit} from '@pages/Gallery/limits';
import noImageGallery from '../../../assets/icons/missing-wall.svg?url';
import './Gallery.css';
import {StandIn} from '@pages/Gallery/StandIn';

export const ArtGallery: FC = () => {
  const {wall, asked, answered, refused, abandoned} = useGallery();
  const {raise} = useBanners();
  const {page, size, search, tab} =
    useSearchParamsObject({page: numberParam, size: numberParam, tab: sourceParam, search: schema.string}, {
      size: defaultRecordLimit,
      page: 1
    });

  useEffect(() => maybe(tab)
    .map(source => {
      const {cancel} = artResource.getAll({page, size, search, source})
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
    .orElse(abandoned), [page, search, tab, size, asked, answered, refused, abandoned, raise]);

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
    {awaited(wall) && <Loading label="loading gallery"/>}
    {wall.reply === 'answered' && empty(wall.answer.pieces) &&
        <StandIn src={noImageGallery} alt="the museum answered with nothing"/>}
    {wall.reply === 'refused' && <StandIn src={noImageGallery} alt="the museum refused to answer"/>}
  </>;
};
