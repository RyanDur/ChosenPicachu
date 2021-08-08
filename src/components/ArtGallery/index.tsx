import {FC, useEffect, useState} from 'react';
import {data, GetArtState} from '../../data';
import {useQuery} from '../hooks';
import {Loading} from '../Loading';
import {Image} from './Image';
import {GalleryNav} from './GalleryNav';
import {useArtGallery} from './Context';
import {AsyncState} from '../../data/types';
import './ArtGallery.scss';
import './ArtGallery.layout.scss';

const ArtGallery: FC = () => {
    const {art, updateArt, reset} = useArtGallery();
    const [loading, isLoading] = useState(false);
    const {page} = useQuery<{ page: number }>({page: 1});

    useEffect(() => {
        data.getAllArt(page, (state: GetArtState) => {
            isLoading(state.type === AsyncState.LOADING);
            if (state.type === AsyncState.SUCCESS) updateArt(state.value);
        });
        return reset;
    }, [page, updateArt]);

    return <section id="art-gallery">
        {loading ? <Loading className="loader" testId="gallery-loading"/> :
            art.pieces.length ? art.pieces.map(piece => <figure
                className="frame" key={piece.id}>
                <Image className="piece" piece={piece} width={200}/>
                <figcaption className="title">{piece.title}</figcaption>
            </figure>) : <img src="https://img.icons8.com/ios/100/ffffff/no-image-gallery.png"
                              id="empty-gallery"
                              alt="empty gallery"
                              data-testid="empty-gallery"/>}
    </section>;
};

export {ArtGallery, GalleryNav};