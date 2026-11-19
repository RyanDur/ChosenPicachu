import {popoversClosed} from './popoversClosed';

type Page = Pick<Window, 'document' | 'addEventListener'>;

const galleryForms = (page: Page): NodeListOf<HTMLFormElement> =>
  page.document.querySelectorAll<HTMLFormElement>('.search-form, .page-control');

// Back and Forward through history leave a popover open, so they close whatever is open and drop what was typed in it;
// a close request, Escape or Android's back gesture, closes a popover without moving history, so it never reaches here.
// React can miss a move that Back undoes before it is drawn, leaving a gallery form showing words the address dropped,
// so the gallery's forms go back to what React last drew
export const typingDroppedOnBackAndForward = (page: Page): void =>
  page.addEventListener('popstate', () => {
    popoversClosed(page, ':popover-open');
    galleryForms(page).forEach(form => form.reset());
  });
