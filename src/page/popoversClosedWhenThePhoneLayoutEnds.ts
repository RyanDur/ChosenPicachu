import {phoneLayout} from './phoneLayout';
import {popoversClosed} from './popoversClosed';

type Page = Pick<Window, 'document' | 'matchMedia'>;

// CSS can't close a popover when its query stops matching,
// so the phone's popovers are closed once the phone layout ends
export const popoversClosedWhenThePhoneLayoutEnds = (page: Page): void =>
  phoneLayout(page).ends(() => popoversClosed(page, '.phone-popover:popover-open'));
