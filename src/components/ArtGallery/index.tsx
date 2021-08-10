import {FC, useEffect, useState} from 'react';
import {data} from '../../data';
import {useQuery} from '../hooks';
import {Loading} from '../Loading';
import {Image} from './Image';
import {GalleryNav} from './GalleryNav';
import {useArtGallery} from './Context';
import {AsyncState} from '../../data/types';
import {GetArtAction} from '../../data/actions';
import './ArtGallery.scss';
import './ArtGallery.layout.scss';

const not = (value: unknown): boolean => !value;
const empty = (value: unknown[] = []): boolean => value.length === 0;
const has = (value: unknown[] = []): boolean => not(empty(value));

const ArtGallery: FC = () => {
    const {art, updateArt, reset} = useArtGallery();
    const [loading, isLoading] = useState(false);
    const [errored, hasErrored] = useState(false);
    const {page} = useQuery<{ page: number }>({page: 1});

    useEffect(() => {
        data.getAllArt(page, (action: GetArtAction) => {
            isLoading(action.type === AsyncState.LOADING);
            hasErrored(action.type === AsyncState.ERROR);
            if (action.type === AsyncState.SUCCESS) updateArt(action.value);
        });
        return reset;
    }, [page, updateArt]);

    const showGallery = not(loading) && has(art?.pieces);
    const showError = not(loading) && (empty(art?.pieces) || errored);

    return <section id="art-gallery">
        {loading && <Loading className="loader" testId="gallery-loading"/>}
        {showGallery && art?.pieces.map(piece => <figure
            className="frame" key={piece.id}>
            <Image className="piece" piece={piece} width={200}/>
            <figcaption className="title">{piece.title}</figcaption>
        </figure>)}
        {showError && <img src="https://img.icons8.com/ios/100/ffffff/no-image-gallery.png"
                           id="empty-gallery"
                           alt="empty gallery"
                           data-testid="empty-gallery"/>}
    </section>;
};

export {ArtGallery, GalleryNav};