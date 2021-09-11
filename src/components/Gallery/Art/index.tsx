import {FC, useEffect, useState} from 'react';
import {data} from '../../../data';
import {useQuery} from '../../hooks';
import {Loading} from '../../Loading';
import {Image} from '../Image';
import {useGallery} from '../Context';
import {AsyncState} from '../../../data/types';
import {GetAllArtAction, toSource} from '../../../data/artGallery/types';
import './Gallery.scss';
import './Gallery.layout.scss';

const not = (value: unknown): boolean => !value;
const empty = (value: unknown[] = []): boolean => value.length === 0;
const has = (value: unknown[] = []): boolean => not(empty(value));

export const ArtGallery: FC = () => {
    const {art, updateArt, reset} = useGallery();
    const [loading, isLoading] = useState(false);
    const [errored, hasErrored] = useState(false);
    const {queryObj: {page, size, search, tab}} = useQuery<{ page: number, size: number, tab: string, search?: string }>();

    useEffect(() => {
        data.artGallery.getAllArt({page, size, search, source: toSource(tab)},
            (action: GetAllArtAction) => {
                isLoading(action.type === AsyncState.LOADING);
                hasErrored(action.type === AsyncState.ERROR);
                if (action.type === AsyncState.LOADED) updateArt(action.value);
            });
        return reset;
    }, [page, updateArt, search, tab, size]);

    const showGallery = not(loading) && has(art?.pieces);
    const showError = not(loading) && (empty(art?.pieces) || errored);

    return <section id="art-gallery">
        {showGallery && art?.pieces.map(piece => <figure
            className="frame" key={piece.id}>
            <Image className="piece" piece={piece}/>
            <figcaption className="title">{piece.title}</figcaption>
        </figure>)}
        {loading && <Loading className="loader" testId="gallery-loading"/>}
        {showError && <img src="https://img.icons8.com/ios/100/000000/no-image-gallery.png"
                           id="empty-gallery"
                           alt="empty gallery"
                           data-testid="empty-gallery"/>}
    </section>;
};