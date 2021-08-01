import {Loading} from '../../Loading';
import {FC, useState} from 'react';
import {Piece} from '../../../data/types';
import {join} from '../../util';
import './Image.scss';
import {Paths} from '../../../App';
import {Link} from 'react-router-dom';

interface ImageProps {
    piece: Partial<Piece>;
    className?: string;
    height?: number
    width?: number
}

export const Image: FC<ImageProps> = ({piece, className, width = '', height = ''}) => {
    const [completed, isComplete] = useState(false);
    const [errored, isError] = useState(false);

    return <>
        <Link to={`${Paths.artGallery}/${piece.id}`}>
            {!errored && <img className={join('image', 'off-screen', className)}
                              onError={() => {
                                  isComplete(true);
                                  isError(true);
                              }}
                              onLoad={event => {
                                  isComplete(true);
                                  isError(false);
                                  event.currentTarget.classList.remove('off-screen');
                              }}
                              alt={piece.altText} title={piece.title}
                              loading="lazy"
                              data-testid={`piece-${piece.imageId}`}
                              src={`https://www.artic.edu/iiif/2/${piece.imageId}/full/${width},${height}/0/default.jpg`}/>}
            {completed || <Loading/>}
        </Link>
        {errored &&
        <a href="https://icons8.com/icon/j1UxMbqzPi7n/no-image" rel="noopener noreferrer" target="_blank"
           className="error">
          <img alt="oops" src="https://img.icons8.com/ios/100/000000/no-image.png" data-testid="error"/>
          No Image icon by Icons8
        </a>}
    </>;
};