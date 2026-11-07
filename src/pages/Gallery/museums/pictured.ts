import {has} from '@ryandur/sand';
import {Art} from '@pages/Gallery/museums/art';

export const pictured = (image: string | null | undefined): Pick<Art, 'image'> => has(image) ? {image} : {};
