import {FC, useEffect} from 'react';
import {numberParam, useSearchParamsObject} from '@components/search-params';
import * as schema from 'schemawax';
import {Loading} from '@components/Loading';
import {Image} from '@components/art-gallery/Image';
import {useGallery} from '@components/art-gallery/Art/Context';
import {empty, has} from '@ryandur/sand';
import {useBanners} from '@components/Banners';
import {troubleWith} from '@transport/trouble';
import {sourceParam} from '@components/art-gallery/museums/source';
import {art as artResource} from '@components/art-gallery/museums';
import {defaultRecordLimit} from '@components/art-gallery/limits';
import noImageGallery from '../../../assets/icons/missing-wall.svg?url';
import './Gallery.css';

export const ArtGallery: FC = () => {
  const {wall, asked, answered, refused, abandoned} = useGallery();
  const {raise} = useBanners();
  const {page, size, search, tab} =
    useSearchParamsObject({page: numberParam, size: numberParam, tab: sourceParam, search: schema.string}, {
      size: defaultRecordLimit,
      page: 1
    });

  useEffect(() => {
    if (!has(page) || !has(size) || !has(tab)) return abandoned;
    const {cancel} = artResource.getAll({page, size, search, source: tab})
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
  }, [page, search, tab, size, asked, answered, refused, abandoned, raise]);

  return <>
    <ul id="art-gallery">
      {wall.reply === 'answered' && wall.answer.map((piece, index) => <li className="frame" key={piece.id}>
        <figure>
          <div className="wall-slot">
            <Image className="piece hung" piece={piece} priority={index < 4} lazy={index >= 6}/>
          </div>
          <figcaption className="placard trim hairline-outline italic">{piece.title}</figcaption>
        </figure>
      </li>)}
    </ul>
    {wall.reply === 'asked' && <Loading label="loading gallery"/>}
    {wall.reply === 'answered' && empty(wall.answer) &&
        <img className="stand-in" src={noImageGallery} alt="the museum answered with nothing"/>}
    {wall.reply === 'refused' && <img className="stand-in" src={noImageGallery} alt="the museum refused to answer"/>}
  </>;
};
