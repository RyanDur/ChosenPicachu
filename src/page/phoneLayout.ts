import {not} from '@ryandur/sand';

type MediaQueries = Pick<Window, 'matchMedia'>;

// Keep in step with the phone query in BasePage.css: CSS can't close a popover when its query stops matching
const phoneQuery = '(width <= 600px), (width <= 1100px) and (height <= 600px)';

export const phoneLayout = (media: MediaQueries) => ({
  ends: (whenItEnds: () => void): void => {
    const phone = media.matchMedia(phoneQuery);
    phone.addEventListener('change', () => {
      if (not(phone.matches)) whenItEnds();
    });
  }
});
