import {FC} from 'react';
import {DragStyle} from '@components/DragSortableTable';
import {PillGlider} from '@components/PillGlider';
import './Controls.css';

export type Motion = 'animated' | 'static';

const dragReadings: Record<DragStyle, string> = {
  'eager-move': 'The column settles into each slot as you carry it — the order updates mid-drag.',
  'lazy-move': 'The table holds still while you drag — the order changes once, where you drop.',
  'hide-eager-move': 'Settles mid-drag like Eager, but the carried column turns invisible while it travels.',
  'hide-lazy-move': 'Waits for the drop like Lazy, and the carried column hides while aloft.'
};

const motionReadings: Record<Motion, string> = {
  static: 'Reorders land in place instantly — nothing animates.',
  animated: 'Displaced neighbors glide out of the way as the order changes.'
};

type Props = {
  dragStyle: DragStyle;
  motion: Motion;
  onDragStyle: (style: DragStyle) => void;
  onMotion: (motion: Motion) => void;
};

export const Controls: FC<Props> = ({dragStyle, motion, onDragStyle, onMotion}) =>
  <section aria-label="table controls" className="table-controls card">
    <article className="control">
      <PillGlider label="drag style"
                  name="column-drag-style"
                  options={[
                    {display: 'Eager', value: 'eager-move'},
                    {display: 'Lazy', value: 'lazy-move'},
                    {display: 'Hide Eager', value: 'hide-eager-move'},
                    {display: 'Hide Lazy', value: 'hide-lazy-move'}
                  ]}
                  chosen={dragStyle}
                  onChoose={onDragStyle}/>
      <p className="reading">{dragReadings[dragStyle]}</p>
    </article>
    <article className="control">
      <PillGlider label="animation style"
                  name="table-animate-or-static"
                  options={[
                    {display: 'Animate', value: 'animated'},
                    {display: 'Static', value: 'static'}
                  ]}
                  chosen={motion}
                  onChoose={onMotion}/>
      <p className="reading">{motionReadings[motion]}</p>
    </article>
  </section>;
