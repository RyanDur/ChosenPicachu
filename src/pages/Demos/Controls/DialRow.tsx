import {FC, PropsWithChildren, ReactNode, useEffect, useId, useState} from 'react';
import {maybe, not} from '@ryandur/sand';
import {PillGlider} from '@components/PillGlider';
import {classNames} from '@components/class-names';
import './DialRow.css';

// a row fits when its name, the gap and its pills fit across it; stacking never changes those widths, so the answer holds
const fitsBeside = (row: Element): boolean => {
  const [name, pills] = [row.querySelector('.axis'), row.querySelector('.pill-glider')];
  const gap = parseFloat(getComputedStyle(row).columnGap);
  return name === null || pills === null
    || name.getBoundingClientRect().width + gap + pills.getBoundingClientRect().width <= row.clientWidth;
};

export const DialGroup: FC<PropsWithChildren> = ({children}) => {
  const id = `dials${useId()}`;
  const [stacked, setStacked] = useState(false);

  // the pills are watched too: their words settle when the font arrives, and the group's own width does not change then
  useEffect(() => {
    const group = document.getElementById(id);
    const watcher = new ResizeObserver(() => maybe(group).map(watched =>
      setStacked(not([...watched.querySelectorAll(':scope > .dial-row')].every(fitsBeside)))));
    maybe(group).map(watched => [watched, ...watched.querySelectorAll(':scope > .dial-row .pill-glider')]
      .forEach(part => watcher.observe(part)));
    return () => watcher.disconnect();
  }, [id]);

  return <ul id={id} className={classNames('dial-group', stacked && 'stacked')}>{children}</ul>;
};

type Props<T extends string> = {
  label: string;
  name: string;
  options: readonly {display: ReactNode; value: T}[];
  chosen: T;
  onChosen: (value: T) => void;
  reading: ReactNode;
};

export const DialRow = <T extends string>({label, reading, ...pills}: Props<T>) =>
  <li className="dial-row">
    <span className="axis caption uppercase" aria-hidden>{label}</span>
    <PillGlider label={label} {...pills}/>
    <output className="reading paragraph">{reading}</output>
  </li>;
