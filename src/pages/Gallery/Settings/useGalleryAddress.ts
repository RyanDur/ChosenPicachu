import {useContext} from 'react';
import {NavigateOptions, useNavigate} from 'react-router';
import {useGallery} from '@pages/Gallery/Context';
import {GalleryLinks} from '@pages/Gallery/Links';

export const useGalleryAddress = () => {
  const navigate = useNavigate();
  const {gallery} = useContext(GalleryLinks);
  const {searchFromAddress, searchWithout} = useGallery();
  const goTo = (search: string, options?: NavigateOptions) =>
    void navigate({pathname: gallery, search}, {preventScrollReset: true, ...options});

  return {
    update: (params: Parameters<typeof searchFromAddress>[0], options?: NavigateOptions) =>
      goTo(searchFromAddress(params), options),
    remove: (keys: string[], options?: NavigateOptions) => goTo(searchWithout(keys), options)
  };
};
