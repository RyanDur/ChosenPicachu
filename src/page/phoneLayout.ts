import {not} from '@ryandur/sand';

export type MediaQueries = Pick<Window, 'matchMedia'>;

export type PhoneLayout = {readonly ends: (left: () => void) => () => void};

// Keep in step with the phone query in BasePage.css: CSS can't close a popover when its query stops matching
const phoneQuery = '(width <= 600px), (width <= 1100px) and (height <= 600px)';

export const phoneLayout = (media: MediaQueries): PhoneLayout => ({
  ends: left => {
    const phone = media.matchMedia(phoneQuery);
    const changed = () => {
      if (not(phone.matches)) left();
    };
    phone.addEventListener('change', changed);
    return () => phone.removeEventListener('change', changed);
  }
});
