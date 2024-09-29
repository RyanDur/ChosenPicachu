import {FC, useEffect, useState} from 'react';
import {useQuery} from '../../hooks';
import {Loading} from '../../Loading';
import {Image} from '../Image';
import {useGallery} from './Context';
import {empty, has} from '@ryandur/sand';
import {Source} from '../resource/types/resource';
import {art as artResource} from '../resource';
import './Gallery.css';
import './Gallery.layout.css';
import {defaultRecordLimit} from "../../../config";

export const ArtGallery: FC = () => {
  const {art, updateArt, reset} = useGallery();
  const [loading, isLoading] = useState(false);
  const [errored, hasErrored] = useState(false);
  const {queryObj: {page, size, search, tab}} =
    useQuery<{ page: number, size: number, tab: Source, search?: string }>({
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
  }, [page, search, tab, size]);

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
