import {Loading} from '../../Loading';
import {FC, useState} from 'react';
import {Piece} from '../../../data/types';
import './Image.scss';
import {join} from '../../util';

interface ImageProps {
    piece: Partial<Piece>;
    className?: string;
    height?: number
    width?: number
}

export const Image: FC<ImageProps> = ({piece, className, width = '', height = ''}) => {
    const [loaded, loading] = useState(true);
    const onComplete = () => loading(false);

    return <>
        <img className={join('image', className)}
            onError={onComplete}
             onLoad={onComplete}
             alt={piece.altText} title={piece.title}
             loading="lazy" data-testid={`piece-${piece.imageId}`}
             src={`https://www.artic.edu/iiif/2/${piece.imageId}/full/${width},${height}/0/default.jpg`}/>
        {loaded && <Loading/>}
    </>;
};