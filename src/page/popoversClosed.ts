type Page = Pick<Window, 'document'>;

const typedValuesDropped = (popover: HTMLElement): void =>
  popover.querySelectorAll('input').forEach(field => field.value = field.defaultValue);

export const popoversClosed = (page: Page, which: string): void =>
  page.document.querySelectorAll<HTMLElement>(which).forEach(popover => {
    typedValuesDropped(popover);
    popover.hidePopover();
  });
