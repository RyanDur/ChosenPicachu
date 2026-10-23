// the browser blurs a focused node when it is moved in the DOM; the reconcile gives the focus back
export const keepingFocus = (focused: Element | null, moving: () => void): void => {
  moving();
  if (focused instanceof HTMLElement && focused.ownerDocument.activeElement !== focused) {
    focused.focus();
  }
};
