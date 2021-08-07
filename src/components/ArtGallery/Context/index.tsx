import {Art, Piece} from '../../../data/types';
import {Consumer} from '../../UserInfo/types';
import {createContext, useContext, useMemo, useState} from 'react';

interface GalleryContext {
    art: Art;
    updateArt: Consumer<Art>;
    reset: Consumer<void>;
}

export const galleryInitialState: Art = {pieces: [] as Piece[]} as Art;

export const ArtGalleryContext = createContext<GalleryContext>({
    art: galleryInitialState,
    updateArt: (art: Art = galleryInitialState) => void art,
    reset: () => void 0
});
export const useArtGallery = () => useContext(ArtGalleryContext);
export const useArtGalleryContext = (): GalleryContext => {
    const [art, updateArt] = useState<Art>(galleryInitialState);
    return useMemo(() => ({art, updateArt, reset: () => updateArt(galleryInitialState)}), [art]);
};