import {FC, PropsWithChildren} from 'react';
import {Motion, Origin} from '@components/DragSortableTable';
import {DialGroup} from './DialGroup';
import {DialRow} from './DialRow';
import {Pace, useControls} from './useControls';
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
  const {pace, origin, motion, change} = useControls();
  const heading = `${copy.kind}-controls-heading`;
  const readout = copy.readout(pace, origin, motion);
  return <details className="demo-settings disclosure" aria-label="settings">
    <summary className="opener">settings <code className="readout caption monospaced">{readout}</code></summary>
    <section aria-labelledby={heading} className="controls">
      <h4 id={heading} className="off-screen">{copy.kind} controls</h4>
      <DialGroup>
        <DialRow label="pace"
          name={`${copy.kind}-pace`}
          choices={[
            {words: 'Eager', value: 'eager'},
            {words: 'Lazy', value: 'lazy'}
          ]}
          chosen={pace}
          onChosen={next => change({pace: next})}
          reading={copy.pace[pace]}/>
        <DialRow label="origin"
          name={`${copy.kind}-origin`}
          choices={[
            {words: 'Keep', value: 'keep'},
            {words: 'Hide', value: 'hide'}
          ]}
          chosen={origin}
          onChosen={next => change({origin: next})}
          reading={copy.origin[origin]}/>
        <DialRow label="motion"
          name={`${copy.kind}-motion`}
          choices={[
            {words: 'Animate', value: 'animated'},
            {words: 'Static', value: 'static'}
          ]}
          chosen={motion}
          onChosen={next => change({motion: next})}
          reading={copy.motion[motion]}/>
      </DialGroup>
      {children}
    </section>
  </details>;
};
