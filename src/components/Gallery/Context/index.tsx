import {createContext, useContext, useMemo, useState} from 'react';
import {AllArt} from '../../../data/artGallery/types';
import {Consumer} from '../../../data/types';

export interface GalleryContextState {
    art?: AllArt;
    updateArt: Consumer<AllArt>;
    reset: Consumer<void>;
}

export const artInitialState: AllArt = {} as AllArt;

export const GalleryContext = createContext<GalleryContextState>({
    art: artInitialState,
    updateArt: (art: AllArt) => void art,
    reset: () => void 0
});
export const useGallery = () => useContext(GalleryContext);
export const useGalleryContext = (): GalleryContextState => {
    const [art, updateArt] = useState<AllArt>();
    return useMemo(() => ({art, updateArt, reset: () => updateArt(undefined)}), [art]);
};