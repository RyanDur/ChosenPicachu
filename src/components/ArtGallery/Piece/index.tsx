import {useParams} from 'react-router-dom';
import './Piece.scss';
export const Piece = () => {
    const {id} = useParams<{ id: string }>();
    console.log('imageId', id);
    return <img className="loading piece"
                onLoad={event => event.currentTarget.classList.remove('loading')}
                loading="lazy" data-testid={`piece-${id}`}
                src={`https://www.artic.edu/iiif/2/${id}/full/,2000/0/default.jpg`} alt={''}/>;
};