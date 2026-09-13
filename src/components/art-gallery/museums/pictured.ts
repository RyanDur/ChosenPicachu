import {has} from '@ryandur/sand';
import {Art} from '@components/art-gallery/museums/art';

export const pictured = (image: string | null | undefined): Pick<Art, 'image'> => has(image) ? {image} : {};
