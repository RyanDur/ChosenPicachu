import {FC, useEffect, useReducer} from 'react';
import {has, maybe} from '@ryandur/sand';
import {bannerChange, useBannerDispatch} from '@banners';
import {plainFold} from './plain-fold';
import {PlainFoldChange, plainFoldChange} from './plain-fold-change';
import './PlainFold.css';

const measured = (body: HTMLElement, dispatch: (change: PlainFoldChange) => void): void => {
  const height = Math.ceil(body.getBoundingClientRect().height);
  if (height > 0) {
    dispatch(plainFoldChange.grown(height));
  }
};

export const PlainFold: FC = () => {
  const dispatchBanner = useBannerDispatch();
  const [{document, body, height}, dispatch] = useReducer(plainFold.reduce, plainFold.initial);

  useEffect(() => {
    let standing = true;
    void import('./assemble').then(({foldAssembly}) => {
      if (standing) {
        dispatch(plainFoldChange.assembled(foldAssembly.document()));
      }
    }).catch(() => dispatchBanner(bannerChange.raised('the plain fold could not be assembled')));
    return () => {
      standing = false;
    };
  }, [dispatchBanner]);

  useEffect(() => maybe(body).map(watched => {
    const watcher = new ResizeObserver(() => measured(watched, dispatch));
    watcher.observe(watched);
    return () => watcher.disconnect();
  }).orElse(undefined), [body]);

  return <iframe className="plain-fold" title="A fold measured by plain script"
    style={has(height) ? {'--stage-block-size': `${height}px`} : undefined}
    onLoad={event => maybe(event.currentTarget.contentDocument?.body).map(loaded => {
      dispatch(plainFoldChange.loaded(loaded));
      measured(loaded, dispatch);
    })}
    srcDoc={document}/>;
};
