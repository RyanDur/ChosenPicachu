import {FC, useEffect, useState} from 'react';
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
  const {art, updateArt, reset} = useGallery();
  const {raise} = useBanners();
  const [wall, setWall] = useState<'bare' | 'loading' | 'hung' | 'empty' | 'refused'>('bare');
  const {page, size, search, tab} =
    useSearchParamsObject({page: numberParam, size: numberParam, tab: sourceParam, search: schema.string}, {
      size: defaultRecordLimit,
      page: 1
    });

  useEffect(() => {
    if (!has(page) || !has(size) || !has(tab)) return reset;
    const {cancel} = artResource.getAll({page, size, search, source: tab})
      .onPending(pending => pending && setWall('loading'))
      .onSuccess(updateArt)
      .onSuccess(data => setWall(empty(data.pieces) ? 'empty' : 'hung'))
      .onFailure(error => {
        setWall('refused');
        raise(troubleWith('the museum')(error));
      });
    return () => {
      cancel();
      reset();
    };
  }, [page, search, tab, size, reset, updateArt, raise]);

  return <>
    <ul id="art-gallery">
      {art?.pieces.map((piece, index) => <li className="frame" key={piece.id}>
        <figure>
          <div className="wall-slot">
            <Image className="piece hung" piece={piece} priority={index < 4} lazy={index >= 6}/>
          </div>
          <figcaption className="trim placard hairline-outline italic">{piece.title}</figcaption>
        </figure>
      </li>)}
    </ul>
    {wall === 'loading' && <Loading label="loading gallery"/>}
    {wall === 'empty' && <img src={noImageGallery} alt="empty gallery"/>}
    {wall === 'refused' && <img src={noImageGallery} alt="the museum refused to answer"/>}
  </>;
};
