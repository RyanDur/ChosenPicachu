import {FC, useEffect, useState} from 'react';
import {numberParam, useSearchParamsObject} from '@components/search-params';
import * as schema from 'schemawax';
import {Loading} from '@components/Loading';
import {Image} from '@components/art-gallery/Image';
import {useGallery} from '@components/art-gallery/Art/Context';
import {empty, has} from '@ryandur/sand';
import {useBanners} from '@components/Banners';
import {troubleWith} from '@transport/trouble';
import {Source, sourceParam} from '@components/art-gallery/museums/types/resource';
import {art as artResource} from '@components/art-gallery/museums';
import {defaultRecordLimit} from '@components/art-gallery/limits';
import noImageGallery from '../../../assets/icons/no-image-gallery.png';
import './Gallery.css';
import './Gallery.layout.css';

export const ArtGallery: FC = () => {
  const {art, updateArt, reset} = useGallery();
  const {raise} = useBanners();
  const [loading, isLoading] = useState(false);
  const [errored, hasErrored] = useState(false);
  const {page, size, search, tab} =
    useSearchParamsObject({page: numberParam, size: numberParam, tab: sourceParam, search: schema.string}, {
      size: defaultRecordLimit,
      page: 1,
      tab: Source.AIC
    });

  useEffect(() => {
    if (!has(page) || !has(size) || !has(tab)) return reset;
    const {cancel} = artResource.getAll({page, size, search, source: tab})
      .onPending(isLoading)
      .onSuccess(updateArt)
      .onSuccess(data => hasErrored(empty(data.pieces)))
      .onFailure(error => {
        hasErrored(true);
        raise(troubleWith('the museum')(error));
      });
    return () => {
      cancel();
      reset();
    };
  }, [page, search, tab, size, reset, updateArt, raise]);

  return <section id="art-gallery">
    {art?.pieces.map((piece, index) => <figure
      className="frame" key={piece.id}>
      <div className="wall-slot">
        <Image className="piece" piece={piece} priority={index < 4} lazy={index >= 6}/>
      </div>
      <figcaption className="placard">{piece.title}</figcaption>
    </figure>)}
    {loading && <Loading className="loader" label="loading gallery"/>}
    {!loading && errored && <img src={noImageGallery}
                                 id="empty-gallery"
                                 alt="empty gallery"/>}
  </section>;
};
