import {not} from '@ryandur/sand';

export type MediaQueries = Pick<Window, 'matchMedia'>;

export type PhoneLayout = {readonly ends: (whenItEnds: () => void) => () => void};

// Keep in step with the phone query in BasePage.css: CSS can't close a popover when its query stops matching
const phoneQuery = '(width <= 600px), (width <= 1100px) and (height <= 600px)';

export const phoneLayout = (media: MediaQueries): PhoneLayout => ({
  ends: whenItEnds => {
    const phone = media.matchMedia(phoneQuery);
    const changed = () => {
      if (not(phone.matches)) whenItEnds();
    };
    phone.addEventListener('change', changed);
    return () => phone.removeEventListener('change', changed);
  }
});
