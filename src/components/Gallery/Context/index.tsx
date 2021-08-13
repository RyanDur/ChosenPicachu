import {Art} from '../../../data/types';
import {Consumer} from '../../UserInfo/types';
import {createContext, useContext, useMemo, useState} from 'react';

export interface GalleryContext {
    art?: Art;
    updateArt: Consumer<Art>;
    reset: Consumer<void>;
}

export const artInitialState: Art = {} as Art;

export const ArtGalleryContext = createContext<GalleryContext>({
    art: artInitialState,
    updateArt: (art: Art) => void art,
    reset: () => void 0
});
export const useArtGallery = () => useContext(ArtGalleryContext);
export const useArtGalleryContext = (): GalleryContext => {
    const [art, updateArt] = useState<Art>();
    return useMemo(() => ({art, updateArt, reset: () => updateArt(undefined)}), [art]);
};