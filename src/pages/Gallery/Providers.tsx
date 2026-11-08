import {FC, PropsWithChildren} from 'react';
import {GalleryLinks} from './Links';
import {GalleryContext} from './Context';

export const GalleryProviders: FC<PropsWithChildren<{gallery: string}>> = ({gallery, children}) =>
  <GalleryLinks.Provider value={{gallery}}>
    <GalleryContext>{children}</GalleryContext>
  </GalleryLinks.Provider>;
