import {Maybe} from '@ryandur/sand';

// the browser blurs a focused node when it is moved in the DOM; the reconcile gives the focus back
export const keepingFocus = (focused: Maybe<Element>, moving: () => void): void => {
  moving();
  focused.map(element => {
    if (element instanceof HTMLElement && element.ownerDocument.activeElement !== element) {
      element.focus();
    }
  });
};
