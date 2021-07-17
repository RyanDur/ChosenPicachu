import {FC, useEffect, useState} from 'react';
import {Art} from '../../data/types';
import {data} from '../../data';

export const ArtGallery: FC = () => {
    const [art, updateArtWork] = useState<Art>();

    useEffect(() => {
        data.getAllArt(updateArtWork);
    }, []);

    return <article>{art?.pieces
        .map(piece => <article key={piece.imageId} data-testid="art"/>)
    }</article>;
};