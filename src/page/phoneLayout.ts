import {not} from '@ryandur/sand';

export type Screen = Pick<Window, 'matchMedia'>;

// Keep in step with the phone query in BasePage.css: CSS can't close a popover when its query stops matching
const phoneQuery = '(width <= 600px), (width <= 1100px) and (height <= 600px)';

export type PhoneLayoutEnds = (left: () => void) => () => void;

export const phoneLayoutEndsOn = (screen: Screen): PhoneLayoutEnds => left => {
  const phone = screen.matchMedia(phoneQuery);
  const changed = () => {
    if (not(phone.matches)) left();
  };
  phone.addEventListener('change', changed);
  return () => phone.removeEventListener('change', changed);
};
