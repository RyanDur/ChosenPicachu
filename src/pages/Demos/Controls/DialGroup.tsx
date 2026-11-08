import {FC, PropsWithChildren, useEffect, useRef, useState} from 'react';
import {maybe, not} from '@ryandur/sand';
import {classNames} from '@components/class-names';

const fitsBeside = (row: Element): boolean => {
  const gap = parseFloat(getComputedStyle(row).columnGap);
  return maybe(row.querySelector('.axis')).and(maybe(row.querySelector('.pill-glider')))
    .map(([name, pills]) =>
      name.getBoundingClientRect().width + gap + pills.getBoundingClientRect().width <= row.clientWidth)
    .orElse(true);
};

export const DialGroup: FC<PropsWithChildren> = ({children}) => {
  const group = useRef<HTMLUListElement>(null);
  const [stacked, setStacked] = useState(false);

  // the pills are watched too: their words settle when the font arrives, and the group's own width does not change then
  useEffect(() => {
    const watcher = new ResizeObserver(() => maybe(group.current).map(watched =>
      setStacked(not([...watched.querySelectorAll(':scope > .dial-row')].every(fitsBeside)))));
    maybe(group.current).map(watched => [watched, ...watched.querySelectorAll(':scope > .dial-row .pill-glider')]
      .forEach(part => watcher.observe(part)));
    return () => watcher.disconnect();
  }, []);

  return <ul ref={group} className={classNames('dial-group', stacked && 'stacked')}>{children}</ul>;
};
