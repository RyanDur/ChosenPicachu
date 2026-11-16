import {FC, PropsWithChildren, useId} from 'react';
import './Reveal.css';

export const Reveal: FC<PropsWithChildren<{summary?: string}>> = ({summary = 'how I built it', children}) => {
  const foldBar = `reveal${useId()}`;
  return <details className="reveal-fold" aria-labelledby={foldBar}>
    <summary id={foldBar} className="fold-bar sub-title muted-ink body-glyph-before">{summary}</summary>
    {children}
  </details>;
};
