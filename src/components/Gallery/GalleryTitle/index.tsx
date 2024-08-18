import {FC} from 'react';
import {useLocation} from 'react-router-dom';
import {Paths} from '../../../routes/Paths';
import {useArtPiece} from '../ArtPiece/Context';

export const GalleryTitle: FC = () => {
  const location = useLocation();
  const {piece} = useArtPiece();
  const title = location.pathname === Paths.artGallery ? 'Gallery' : piece.title;
  return <>{title}</>;
};
