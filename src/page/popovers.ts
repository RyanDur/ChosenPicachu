import {phoneLayout} from './phoneLayout';

type Page = Pick<Window, 'document' | 'addEventListener' | 'matchMedia'>;

const typedValuesDropped = (popover: HTMLElement): void =>
  popover.querySelectorAll('input').forEach(field => field.value = field.defaultValue);

export const popovers = (page: Page) => {
  const closed = (which: string): void =>
    page.document.querySelectorAll<HTMLElement>(which).forEach(popover => {
      typedValuesDropped(popover);
      popover.hidePopover();
    });
  return {
    closed,
    // CSS can't close a popover when its query stops matching,
    // so the phone's popovers are closed once the phone layout ends
    closedWhenThePhoneLayoutEnds: (): void => phoneLayout(page).ends(() => closed('.phone-popover:popover-open')),
    // Back and Forward through history leave a popover open,
    // so they close whatever is open and drop what was typed in it;
    // a close request, Escape or Android's back gesture, closes a popover without moving history,
    // so it never reaches here
    closedOnBackAndForward: (): void => page.addEventListener('popstate', () => closed(':popover-open'))
  };
};
