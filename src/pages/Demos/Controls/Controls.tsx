import {FC, PropsWithChildren} from 'react';
import {Motion, Origin} from '@components/DragSortableTable';
import {ControlDials} from './ControlDials';
import {useControls} from './useControls';
import {Pace} from '../ReaderSettings';
import '../../Disclosure.css';
import './Controls.css';

export type Copy = {
  kind: 'list' | 'table';
  readout: (pace: Pace, origin: Origin, motion: Motion) => string;
  pace: Record<Pace, string>;
  origin: Record<Origin, string>;
  motion: Record<Motion, string>;
};

export type Dials = {
  pace: Pace;
  origin: Origin;
  motion: Motion;
};

export const Controls: FC<PropsWithChildren<{copy: Copy}>> = ({copy, children}) => {
  const {pace, origin, motion} = useControls();
  const heading = `${copy.kind}-controls-heading`;
  const readout = copy.readout(pace, origin, motion);
  return <details className="demo-settings disclosure" aria-label="settings">
    <summary className="fold-bar">settings <code className="readout caption monospaced">{readout}</code></summary>
    <section aria-labelledby={heading} className="controls">
      <h4 id={heading} className="off-screen">{copy.kind} controls</h4>
      <ControlDials copy={copy}/>
      {children}
    </section>
  </details>;
};
