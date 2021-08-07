import {FC, useEffect, useState} from 'react';
import {data} from '../../data';
import {useQuery} from '../hooks';
import {Loading} from '../Loading';
import {Image} from './Image';
import {GalleryNav} from './GalleryNav';
import {useArtGallery} from './Context';
import './ArtGallery.scss';
import './ArtGallery.layout.scss';

const ArtGallery: FC = () => {
    const {art, updateArt, reset} = useArtGallery();
    const [loading, isLoading] = useState(false);
    const {page} = useQuery<{ page: number }>({page: 1});

    useEffect(() => {
        data.getAllArt(page, {
            onSuccess: updateArt,
            onLoading: isLoading
        });
        return reset;
    }, [page]);

    return <section id="art-gallery">
        {loading ? <Loading className="loader" testId="gallery-loading"/> :
            art.pieces.map(piece => <figure
                className="frame" key={piece.id}>
                <Image className="piece" piece={piece} width={200}/>
                <figcaption className="title">{piece.title}</figcaption>
            </figure>)}
    </section>;
};

export {ArtGallery, GalleryNav};