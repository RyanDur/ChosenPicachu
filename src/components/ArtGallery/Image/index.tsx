import {FC, useState} from 'react';
import {Piece} from '../../../data/types';
import {join} from '../../util';
import {Loading} from '../../Loading';
import {Paths} from '../../../App';
import {Link} from 'react-router-dom';
import './Image.scss';

interface ImageProps {
    piece: Partial<Piece>;
    className?: string;
    height?: number;
    width?: number;
    linkEnabled?: boolean;
}

export const Image: FC<ImageProps> = (
    {
        piece,
        className,
        width = '',
        height = '',
        linkEnabled = true
    }) => {
    const [completed, isComplete] = useState(false);
    const [errored, isError] = useState(false);
    const gotoTopOfPage = () => window.scrollTo(0, 0);
    const ConditionalLink: FC = ({children}) => linkEnabled ?
        <Link onClick={gotoTopOfPage} to={`${Paths.artGallery}/${piece.id}`} className="scrim">{children}</Link> : <>{children}</>;

    return errored ?
        <img alt="oops"
             className="error"
             src="https://img.icons8.com/ios/100/000000/no-image.png"
             data-testid="error"/> :
        (<>
            <ConditionalLink>
                <img className={join('image', 'off-screen', className)}
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
                     src={`https://www.artic.edu/iiif/2/${piece.imageId}/full/${width},${height}/0/default.jpg`}/>
            </ConditionalLink>
            {completed || <Loading/>}
        </>);
};