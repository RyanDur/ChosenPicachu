import {Art} from '../../../data/types';
import {Consumer} from '../../UserInfo/types';
import {createContext, useContext, useMemo, useState} from 'react';

interface GalleryContext {
    art: Partial<Art>;
    updateArt: Consumer<Art>;
    reset: Consumer<void>;
}

export const ArtGalleryContext = createContext<GalleryContext>({
    art: {},
    updateArt: (art: Partial<Art> = {}) => void art,
    reset: () => void 0
});
export const useArtGallery = () => useContext(ArtGalleryContext);
export const useArtGalleryContext = (): GalleryContext => {
    const [art, updateArt] = useState<Partial<Art>>({});
    return useMemo(() => ({art, updateArt, reset: () => updateArt({})}), [art]);
};