import {has} from '@ryandur/sand';
import {Art} from '@pages/Gallery/museums/types';

type MuseumField = string | null | undefined;
type ArtFields = {
  readonly attributed: (artist: MuseumField) => Pick<Art, 'artistInfo'>;
  readonly pictured: (image: MuseumField) => Pick<Art, 'image'>;
};

export const artFields: ArtFields = {
  attributed: artist => has(artist) ? {artistInfo: artist} : {},
  pictured: image => has(image) ? {image} : {}
};
