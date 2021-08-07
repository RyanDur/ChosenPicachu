import {Art, Piece} from '../../../data/types';
import {Consumer} from '../../UserInfo/types';
import {createContext, useContext, useMemo, useState} from 'react';

export interface GalleryContext {
    art: Art;
    updateArt: Consumer<Art>;
    reset: Consumer<void>;
}

export const artInitialState: Art = {pieces: [] as Piece[]} as Art;

export const ArtGalleryContext = createContext<GalleryContext>({
    art: artInitialState,
    updateArt: (art: Art = artInitialState) => void art,
    reset: () => void 0
});
export const useArtGallery = () => useContext(ArtGalleryContext);
export const useArtGalleryContext = (): GalleryContext => {
    const [art, updateArt] = useState<Art>(artInitialState);
    return useMemo(() => ({art, updateArt, reset: () => updateArt(artInitialState)}), [art]);
};