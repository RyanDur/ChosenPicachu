import {Art} from '../../../data/types';
import {Consumer} from '../../UserInfo/types';
import {createContext, useContext, useMemo, useState} from 'react';

export interface GalleryContextState {
    art?: Art;
    updateArt: Consumer<Art>;
    reset: Consumer<void>;
}

export const artInitialState: Art = {} as Art;

export const GalleryContext = createContext<GalleryContextState>({
    art: artInitialState,
    updateArt: (art: Art) => void art,
    reset: () => void 0
});
export const useGallery = () => useContext(GalleryContext);
export const useGalleryContext = (): GalleryContextState => {
    const [art, updateArt] = useState<Art>();
    return useMemo(() => ({art, updateArt, reset: () => updateArt(undefined)}), [art]);
};