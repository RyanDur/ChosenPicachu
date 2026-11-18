import {not} from '@ryandur/sand';
import {phoneQuery} from './phoneQuery';

type MediaQueries = Pick<Window, 'matchMedia'>;

export const phoneLayout = (media: MediaQueries) => ({
  ends: (whenItEnds: () => void): void => {
    const phone = media.matchMedia(phoneQuery);
    phone.addEventListener('change', () => {
      if (not(phone.matches)) whenItEnds();
    });
  }
});
