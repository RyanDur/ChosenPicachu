import {FC, PropsWithChildren} from 'react';
import {Motion, Origin} from '@components/DragSortableTable';
import {Disclosure} from '@components/Disclosure';
import {DialGroup, DialRow} from './DialRow';
import {Pace, useControls} from './useControls';
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
  return <Disclosure label="settings" className="demo-settings"
    prompt={<>settings{' '}<code className="readout caption monospaced">{copy.readout(pace, origin, motion)}</code></>}>
    <section aria-labelledby={heading} className="controls">
      <h4 id={heading} className="off-screen">{copy.kind} controls</h4>
      <DialGroup>
        <DialRow label="pace"
          name={`${copy.kind}-pace`}
          options={[
            {display: 'Eager', value: 'eager'},
            {display: 'Lazy', value: 'lazy'}
          ]}
          chosen={pace}
          onChosen={next => change({pace: next})}
          reading={copy.pace[pace]}/>
        <DialRow label="origin"
          name={`${copy.kind}-origin`}
          options={[
            {display: 'Keep', value: 'keep'},
            {display: 'Hide', value: 'hide'}
          ]}
          chosen={origin}
          onChosen={next => change({origin: next})}
          reading={copy.origin[origin]}/>
        <DialRow label="motion"
          name={`${copy.kind}-motion`}
          options={[
            {display: 'Animate', value: 'animated'},
            {display: 'Static', value: 'static'}
          ]}
          chosen={motion}
          onChosen={next => change({motion: next})}
          reading={copy.motion[motion]}/>
      </DialGroup>
      {children}
    </section>
  </Disclosure>;
};
