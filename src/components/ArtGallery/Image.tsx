import {Loading} from '../Loading';
import {FC, useState} from 'react';
import {Piece} from '../../data/types';

interface ImageProps {
    piece: Partial<Piece>;
    height?: number
    width?: number
}

export const Image: FC<ImageProps> = ({piece, width = '', height = ''}) => {
    const [loaded, loading] = useState(true);
    const onComplete = () => loading(false);

    return <>
        <img className="piece"
             onError={onComplete}
             onLoad={onComplete}
             alt={piece.altText} title={piece.title}
             loading="lazy" data-testid={`piece-${piece.imageId}`}
             src={`https://www.artic.edu/iiif/2/${piece.imageId}/full/${width},${height}/0/default.jpg`}/>
        {loaded && <Loading className={'piece'}/>}
    </>;
};