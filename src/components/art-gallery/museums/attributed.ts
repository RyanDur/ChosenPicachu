import {has} from '@ryandur/sand';
import {Art} from '@components/art-gallery/museums/art';

export const attributed = (artist: string | null | undefined): Pick<Art, 'artistInfo'> => has(artist) ? {artistInfo: artist} : {};
