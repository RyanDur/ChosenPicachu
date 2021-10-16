import {FC, useEffect, useState} from 'react';
import {data} from '../../../data';
import {useQuery} from '../../hooks';
import {Loading} from '../../Loading';
import {Image} from '../Image';
import {useGallery} from '../Context';
import {empty} from '@ryandur/sand';
import {Source} from '../../../data/artGallery/types/resource';
import './Gallery.scss';
import './Gallery.layout.scss';

export const ArtGallery: FC = () => {
    const {art, updateArt, reset} = useGallery();
    const [loading, isLoading] = useState(false);
    const [errored, hasErrored] = useState(false);
    const {queryObj: {page, size, search, tab}} =
        useQuery<{ page: number, size: number, tab: Source, search?: string }>();

    useEffect(() => {
        data.artGallery.getAllArt({page, size, search, source: tab})
            .onLoading(isLoading)
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