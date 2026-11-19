import {useContext} from 'react';
import {useLocation} from 'react-router';
import {GalleryLinks} from '@pages/Gallery/Links';

export const useOnTheGallery = (): boolean => {
  const {gallery} = useContext(GalleryLinks);
  return useLocation().pathname === gallery;
};
