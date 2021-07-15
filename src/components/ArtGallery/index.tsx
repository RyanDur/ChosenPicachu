import {FC, useEffect, useState} from 'react';
import {Art} from '../../data/types';
import {data} from '../../data';

export const ArtGallery: FC = () => {
    const [art, updateArtWork] = useState<Art>();

    useEffect(() => {
        data.getArt(updateArtWork);
    }, []);
    return <article>{
        art?.pieces
        .map(piece => <article key={piece.image_id} data-testid="art"/>)
    }</article>;
};