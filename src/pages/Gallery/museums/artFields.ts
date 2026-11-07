import {has} from '@ryandur/sand';
import {Art} from '@pages/Gallery/museums/art';

type Fields = string | null | undefined;
type ArtFields = {
  readonly attributed: (artist: Fields) => Pick<Art, 'artistInfo'>;
  readonly pictured: (image: Fields) => Pick<Art, 'image'>;
};

export const artFields: ArtFields = {
  attributed: artist => has(artist) ? {artistInfo: artist} : {},
  pictured: image => has(image) ? {image} : {}
};
