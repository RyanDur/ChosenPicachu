import {FC, useEffect, useState} from 'react';
import {Art} from '../../data/types';
import {data} from '../../data';

export const ArtGallery: FC = () => {
    const [art, updateArtWork] = useState<Art>();

    useEffect(() => {
        data.getAllArt(updateArtWork);
    }, []);

    return <article>{art?.pieces
        .map(piece => <article key={piece.imageId} data-testid="art">
            <img className="card"
                src={`https://www.artic.edu/iiif/2/${piece.imageId}/full/200,/0/default.jpg`}
                 alt={piece.title} loading="lazy" data-testid="piece"/>
        </article>)
    }</article>;
};