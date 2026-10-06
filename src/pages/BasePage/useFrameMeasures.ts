import {useEffect} from 'react';
import {maybe} from '@ryandur/sand';

const publishFrameMeasures = (): void => {
  maybe(document.querySelector('main')).map(main =>
    document.documentElement.style.setProperty('--main-reach', `${main.offsetTop}px`));
  maybe(document.getElementById('app-header')).map(header =>
    document.documentElement.style.setProperty('--header-block', `${header.offsetHeight}px`));
};

// the frame's parts stick below a header whose height differs by page, and a style cannot read another element's size
export const useFrameMeasures = (): void => {
  useEffect(() => {
    const watcher = new ResizeObserver(publishFrameMeasures);
    maybe(document.getElementById('root')).map(root => watcher.observe(root));
    return () => watcher.disconnect();
  }, []);
};
