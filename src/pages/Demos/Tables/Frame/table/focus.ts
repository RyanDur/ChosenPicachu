// the browser blurs a focused node when it is moved in the DOM; the reconcile gives the focus back
export const keepingFocus = (document: Document, moving: () => void): void => {
  const focused = document.activeElement;
  moving();
  if (focused instanceof HTMLElement && document.activeElement !== focused) {
    focused.focus();
  }
};
