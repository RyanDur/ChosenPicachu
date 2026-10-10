import {FC, PropsWithChildren} from 'react';
import {GalleryLinks} from './Links';
import {GalleryContext} from './Art/Context';
import {ArtPieceContext} from './ArtPiece/Context';

export const GalleryProviders: FC<PropsWithChildren<{gallery: string}>> = ({gallery, children}) =>
  <GalleryLinks.Provider value={{gallery}}>
    <GalleryContext>
      <ArtPieceContext>{children}</ArtPieceContext>
    </GalleryContext>
  </GalleryLinks.Provider>;
