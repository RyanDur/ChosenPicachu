import {has} from '@ryandur/sand';
import {Art} from '@pages/Gallery/museums/types';

type MuseumField = string | null | undefined;
type ArtFields = {
  readonly attributed: (artist: MuseumField) => Pick<Art, 'artistInfo'>;
  readonly pictured: (src: MuseumField) => Pick<Art, 'picture'>;
};

export const artFields: ArtFields = {
  attributed: artist => has(artist) ? {artistInfo: artist} : {},
  pictured: src => has(src) ? {picture: {src}} : {}
};
