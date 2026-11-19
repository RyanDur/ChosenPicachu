import {popoversClosed} from './popoversClosed';

type Page = Pick<Window, 'document' | 'addEventListener'>;

// Back and Forward through history leave a popover open, so they close whatever is open and drop what was typed in it;
// a close request, Escape or Android's back gesture, closes a popover without moving history, so it never reaches here
export const popoversClosedOnBackAndForward = (page: Page): void =>
  page.addEventListener('popstate', () => popoversClosed(page, ':popover-open'));
