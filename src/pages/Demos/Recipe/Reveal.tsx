import {FC, PropsWithChildren, useId} from 'react';
import './Reveal.css';

export const Reveal: FC<PropsWithChildren<{summary?: string}>> = ({summary = 'how I built it', children}) => {
  const opener = `reveal${useId()}`;
  return <details className="reveal-fold" aria-labelledby={opener}>
    <summary id={opener} className="opener sub-title muted-ink body-glyph-before">{summary}</summary>
    {children}
  </details>;
};
