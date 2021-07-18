import {FC, useEffect, useState} from 'react';
import {Art} from '../../data/types';
import {data} from '../../data';
import './ArtGallery.layout.scss';

export const ArtGallery: FC = () => {
    const [art, updateArtWork] = useState<Art>();

    useEffect(() => {
        data.getAllArt(updateArtWork);
    }, []);

    return <section id="art-gallery">{art?.pieces
        .map(piece => <img className="card loading" key={piece.imageId}
                           onLoad={event => event.currentTarget.classList.remove('loading')}
                           alt={piece.title} loading="lazy" data-testid="piece" tabIndex={0}
                           src={`https://www.artic.edu/iiif/2/${piece.imageId}/full/200,/0/default.jpg`}/>)
    }</section>;
};