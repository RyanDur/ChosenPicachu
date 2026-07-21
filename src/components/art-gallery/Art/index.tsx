import {FC, useEffect, useState} from 'react';
import {useSearchParamsObject} from '@libraries/search-params';
import {Loading} from '@components/art-gallery/Loading';
import {Image} from '@components/art-gallery/Image';
import {useGallery} from '@components/art-gallery/Art/Context';
import {empty, has} from '@ryandur/sand';
import {Source} from '@components/art-gallery/museums/types/resource';
import {art as artResource} from '@components/art-gallery/museums';
import {defaultRecordLimit} from '@components/art-gallery/museums/config';
import './Gallery.css';
import './Gallery.layout.css';

export const ArtGallery: FC = () => {
  const {art, updateArt, reset} = useGallery();
  const [loading, isLoading] = useState(false);
  const [errored, hasErrored] = useState(false);
  const {page, size, search, tab} =
    useSearchParamsObject<{ page: number, size: number, tab: Source, search?: string }>({
      size: defaultRecordLimit,
      page: 1,
      tab: Source.AIC
    });

  useEffect(() => {
    if (has(page) && has(size)) artResource.getAll({page, size: size || defaultRecordLimit, search, source: tab})
      .onPending(isLoading)
      .onSuccess(updateArt)
      .onSuccess(data => hasErrored(empty(data.pieces)))
      .onFailure(() => hasErrored(true));
    return reset;
  }, [page, search, tab, size, reset, updateArt]);

  return <section id="art-gallery">
    {art?.pieces.map(piece => <figure
      className="frame" key={piece.id}>
      <Image className="piece" piece={piece}/>
      <figcaption className="title">{piece.title}</figcaption>
    </figure>)}
    {loading && <Loading className="loader" testId="gallery-loading"/>}
    {!loading && errored && <img src="https://img.icons8.com/ios/100/000000/no-image-gallery.png"
                                 id="empty-gallery"
                                 alt="empty gallery"
                                 data-testid="empty-gallery"/>}
  </section>;
};
