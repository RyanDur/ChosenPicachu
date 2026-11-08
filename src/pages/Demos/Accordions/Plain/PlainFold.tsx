import {FC, useEffect, useState} from 'react';
import {has, maybe} from '@ryandur/sand';
import {bannerChange, useBannerDispatch} from '@components/Banners';
import './PlainFold.css';

const measured = (body: HTMLElement, grown: (height: number) => void): void => {
  const height = Math.ceil(body.getBoundingClientRect().height);
  if (height > 0) {
    grown(height);
  }
};

export const PlainFold: FC = () => {
  const dispatchBanner = useBannerDispatch();
  const [document, setDocument] = useState<string>();
  const [frame, setFrame] = useState<HTMLIFrameElement>();
  const [height, setHeight] = useState<number>();

  useEffect(() => {
    let standing = true;
    void import('./assemble').then(({foldDocument}) => {
      if (standing) {
        setDocument(foldDocument());
      }
    }).catch(() => dispatchBanner(bannerChange.raised('the plain fold could not be assembled')));
    return () => {
      standing = false;
    };
  }, [dispatchBanner]);

  useEffect(() => maybe(frame?.contentDocument?.body).map(body => {
    const watcher = new ResizeObserver(() => measured(body, setHeight));
    watcher.observe(body);
    return () => watcher.disconnect();
  }).orElse(undefined), [frame]);

  return has(document)
    ? <iframe className="plain-fold" title="A fold measured by plain script"
      style={has(height) ? {'--stage-block-size': `${height}px`} : undefined}
      onLoad={event => {
        setFrame(event.currentTarget);
        maybe(event.currentTarget.contentDocument?.body).map(body => measured(body, setHeight));
      }}
      srcDoc={document}/>
    : <div className="plain-fold"/>;
};
