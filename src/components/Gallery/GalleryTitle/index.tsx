import {FC} from 'react';
import {useLocation} from 'react-router-dom';
import {useArtPiece} from '../ArtPiece';
import {Paths} from '../../../routes/Paths.ts';

export const GalleryTitle: FC = () => {
  const location = useLocation();
  const {piece} = useArtPiece();
  const title = location.pathname === Paths.artGallery ? 'Gallery' : piece.title;
  return <>{title}</>;
};
