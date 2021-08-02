import {FC, useEffect} from 'react';
import {data} from '../../data';
import {useQuery} from '../hooks';
import {Loading} from '../Loading';
import {Image} from './Image';
import {GalleryNav} from './GalleryNav';
import {useArtGallery} from './Context';
import './ArtGallery.scss';
import './ArtGallery.layout.scss';

const ArtGallery: FC = () => {
    const {art, updateArt} = useArtGallery();
    const {page} = useQuery<{ page: number }>({page: 1});

    useEffect(() => {
        updateArt({});
        data.getAllArt(updateArt, +page);
    }, [page, updateArt]);

    return <section id="art-gallery">
        {art?.pieces?.length ? art?.pieces
            .map(piece => <figure className="frame" key={piece.id}>
                <Image className="piece" piece={piece} width={200}/>
                <figcaption className="title">{piece.title}</figcaption>
            </figure>) : <Loading className="loader"/>}
    </section>;
};

export {ArtGallery, GalleryNav};