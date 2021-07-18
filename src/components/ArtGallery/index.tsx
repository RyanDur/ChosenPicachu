import {FC, useEffect, useState} from 'react';
import {Art} from '../../data/types';
import {data} from '../../data';
import './ArtGallery.scss';

export const ArtGallery: FC = () => {
    const [art, updateArtWork] = useState<Art>();

    useEffect(() => {
        data.getAllArt(updateArtWork);
    }, []);

    return <section id="art-gallery">{art?.pieces
        .map(piece => <figure className="card">
            <figcaption className="title">{piece.title}</figcaption>
            <img className="loading" key={piece.imageId}
                 onLoad={event => event.currentTarget.classList.remove('loading')}
                 alt={piece.altText} loading="lazy" data-testid="piece" tabIndex={0}
                 title={piece.title}
                 src={`https://www.artic.edu/iiif/2/${piece.imageId}/full/200,/0/default.jpg`}/>
        </figure>)}
        <nav className="pagination"/>
    </section>;
};